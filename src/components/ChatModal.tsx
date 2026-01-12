"use client";

import { useState } from "react";
import { AIModel } from "@/types";
import { X, Send, Bot, User, Copy, Check, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';

interface ChatModalProps {
    model: AIModel;
    apiKey: string;
    provider: string;
    onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ model, apiKey, provider, onClose }) => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSend = async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setResponse(""); // Reset response for new prompt

        try {
            const res = await fetch("http://localhost:8000/generation/stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model_id: model.id,
                    provider: provider,
                    prompt: prompt,
                    api_key: apiKey
                })
            });

            if (!res.body) throw new Error("No response body");
            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                setResponse((prev) => prev + chunk);
            }
        } catch (e) {
            console.error(e);
            setResponse("Error: Failed to generate response.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white leading-none">{model.name}</h3>
                            <span className="text-xs text-slate-400">{provider}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950/50">
                    {/* Response Display */}
                    {response ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase text-primary tracking-wider">Response</span>
                                <button onClick={handleCopy} className="text-slate-500 hover:text-white transition-colors">
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="markdown-content text-slate-300">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {response}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 min-h-[200px]">
                            <div className="mb-4 relative">
                                <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap size={16} className="text-primary animate-pulse" />
                                </div>
                            </div>
                            <p className="animate-pulse text-slate-400">Thinking...</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 min-h-[200px]">
                            <Bot size={48} className="mb-4 opacity-20" />
                            <p>Enter a prompt to start generating with {model.name}...</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={`Ask ${model.name} something...`}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none h-[60px] custom-scrollbar"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !prompt.trim()}
                            className={cn(
                                "absolute right-2 top-2 p-2 rounded-lg transition-all",
                                prompt.trim() && !isLoading
                                    ? "bg-primary text-black hover:bg-primary/90"
                                    : "bg-transparent text-slate-600 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 text-center">
                        Response times depend on {provider}'s API status.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
