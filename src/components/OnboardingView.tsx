"use client";

import { motion } from "framer-motion";
import { Key, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OnboardingViewProps {
    onConnect: (key: string, provider: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onConnect }) => {
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState("OpenAI"); // Default for now

    const handleConnect = () => {
        if (apiKey.trim().length > 5) {
            onConnect(apiKey, provider);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 ring-1 ring-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <Key size={32} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-3">
                        Connect & Battle
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Enter your API credentials to discover and evaluate the latest AI models relative to your account.
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl border-t border-white/10 relative overflow-hidden group">
                    {/* Decorative sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Provider</label>
                            <div className="grid grid-cols-2 gap-2 mb-4 max-h-[140px] overflow-y-auto custom-scrollbar">
                                {["OpenAI", "Google", "OpenRouter", "Groq", "Grok", "Mistral"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setProvider(p)}
                                        className={cn(
                                            "py-2 px-4 rounded-lg text-sm font-medium transition-all border",
                                            provider === p
                                                ? "bg-primary text-black border-primary"
                                                : "bg-slate-900/50 border-white/10 text-slate-400 hover:bg-white/5"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">API Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={`sk-...`}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                />
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                                <ShieldCheck size={10} />
                                Your keys are stored locally and sent only to the provider.
                            </p>
                        </div>

                        <button
                            onClick={handleConnect}
                            disabled={apiKey.length < 5}
                            className={cn(
                                "w-full h-12 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95",
                                apiKey.length >= 5
                                    ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                            )}
                        >
                            Start Discovery <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
