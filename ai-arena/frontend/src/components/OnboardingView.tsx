"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Key, Cpu } from "lucide-react";

interface OnboardingViewProps {
    onComplete: (apiKey: string, provider: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState<string>("OpenAI");

    // Security Modal State
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [hasAcceptedSecurity, setHasAcceptedSecurity] = useState(false);
    const [typedText, setTypedText] = useState("");

    const fullText = "Security Notice:\n\nWe do NOT store your API key.\nWe do NOT use it for any purpose other than your direct requests.\nYour key stays in your browser's local memory and is sent directly to the provider.";

    const providers = ["OpenAI", "Google", "Anthropic", "Groq", "OpenRouter", "Grok", "Mistral"];

    useEffect(() => {
        if (showSecurityModal && typedText.length < fullText.length) {
            const timeout = setTimeout(() => {
                setTypedText(fullText.slice(0, typedText.length + 1));
            }, 30);
            return () => clearTimeout(timeout);
        }
    }, [showSecurityModal, typedText]);

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!hasAcceptedSecurity) {
            e.target.blur();
            setShowSecurityModal(true);
            setTypedText("");
        }
    };

    const handleAccept = () => {
        setHasAcceptedSecurity(true);
        setShowSecurityModal(false);
    };

    return (
        <>
            <AnimatePresence>
                {showSecurityModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                            <div className="flex items-center gap-3 mb-6 text-red-400">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <Key size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Security Check</h3>
                            </div>

                            <div className="min-h-[120px] mb-8 font-mono text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {typedText}
                                <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                            </div>

                            <button
                                onClick={handleAccept}
                                disabled={typedText.length < fullText.length}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${typedText.length < fullText.length
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                    : "bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20"
                                    }`}
                            >
                                {typedText.length < fullText.length ? "Reading..." : "I Understand"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto relative z-10 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                        <Key size={32} />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                        Enter your API Key
                    </h2>
                    <p className="text-slate-400">
                        To start discovering and using models, please provide your API key. Keys are never stored remotely.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full space-y-4"
                >
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {providers.map((p) => (
                            <motion.button
                                key={p}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setProvider(p)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all shadow-sm ${provider === p
                                    ? "bg-primary text-slate-900 border-primary shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                    }`}
                            >
                                {p}
                            </motion.button>
                        ))}
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                            <Key size={18} />
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onFocus={handleInputFocus}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={`Start with ${provider === "OpenAI" ? "sk-..." : "..."}`}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <button
                        onClick={() => onComplete(apiKey, provider)}
                        disabled={!apiKey}
                        className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        Continue to Wallet
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </>
    );
};
