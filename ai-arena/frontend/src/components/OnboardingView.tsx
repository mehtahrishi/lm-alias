"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Key, Cpu } from "lucide-react";

interface OnboardingViewProps {
    onComplete: (apiKey: string, provider: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState<string>("OpenAI");

    const providers = ["OpenAI", "Google", "Anthropic", "Groq", "OpenRouter", "Grok", "Mistral"];

    return (
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
                <div className="grid grid-cols-3 gap-2 mb-4 overflow-y-auto max-h-[120px] custom-scrollbar p-1">
                    {providers.map((p) => (
                        <button
                            key={p}
                            onClick={() => setProvider(p)}
                            className={`p-2 rounded-lg text-sm font-medium border transition-all ${provider === p
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-slate-900/50 border-white/10 text-slate-400 hover:bg-white/5"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                        <Key size={18} />
                    </div>
                    <input
                        type="password"
                        value={apiKey}
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
    );
};
