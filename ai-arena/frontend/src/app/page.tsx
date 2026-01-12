"use client";

import { useState, useEffect } from "react";
import { AIModel } from "@/types";
import { ModelCard } from "@/components/ModelCard";
import { OnboardingView } from "@/components/OnboardingView";
import { ChatModal } from "@/components/ChatModal";
import { MouseTrail } from "@/components/MouseTrail";
import { Sparkles, Wallet, Search, LogOut, Brain, Cpu, Zap, Wind } from "lucide-react";

export default function Home() {
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState("");
    const [stage, setStage] = useState<"auth" | "discovery">("auth");
    const [models, setModels] = useState<AIModel[]>([]);
    const [activeModel, setActiveModel] = useState<AIModel | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAuth = (key: string, prov: string) => {
        setApiKey(key);
        setProvider(prov);
        setStage("discovery");
        fetchModels(key, prov);
    };

    const handleBack = () => {
        setApiKey("");
        setProvider("");
        setModels([]);
        setStage("auth");
    };

    const fetchModels = async (key: string, prov: string) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/discovery/models?provider=${prov}`, {
                headers: {
                    "X-API-Key": key
                }
            });
            const data = await res.json();
            setModels(data);
        } catch (e) {
            console.error("Failed to fetch models", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
            {/* Superb Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Deep Space Base */}
                <div className="absolute inset-0 bg-[#0B1120]" />

                {/* Animated Glow Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-blob" />
                <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen animate-blob animation-delay-4000" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <MouseTrail />

            {/* Header */}
            <header className="relative z-10 w-full max-w-5xl mx-auto mb-16 pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">

                    {/* Title Text */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-primary/50 tracking-tight mb-2">
                            AI Wallet
                        </h1>
                        <p className="text-sm text-slate-400 font-medium tracking-[0.2em] uppercase opacity-80">
                            Know the models your API holds
                        </p>
                    </div>
                </div>

                {/* Exit Button (Absolute positioning for cleaner look) */}
                {stage === "discovery" && (
                    <div className="absolute top-6 right-0">
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all text-slate-400 hover:text-white flex items-center gap-2 group backdrop-blur-sm"
                        >
                            <span className="text-xs font-semibold uppercase tracking-wider hidden md:block">Log Out</span>
                            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}
            </header>

            {stage === "auth" && <OnboardingView onComplete={handleAuth} />}

            {stage === "discovery" && (
                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <Search size={20} className="text-primary" />
                            Discovered Models
                            <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-slate-300 ml-2">
                                {models ? models.length : 0}
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {models.length > 0 ? (
                                models.map((model) => (
                                    <ModelCard
                                        key={model.id}
                                        model={model}
                                        isSelected={activeModel?.id === model.id}
                                        onToggle={() => setActiveModel(model)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-slate-500">
                                    No models found. Check your API key.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Chat Modal */}
            {activeModel && (
                <ChatModal
                    model={activeModel}
                    apiKey={apiKey}
                    provider={provider}
                    onClose={() => setActiveModel(null)}
                />
            )}

            {/* Footer */}
            <footer className="relative z-10 py-12 mt-auto text-center">
                <p className="flex items-center justify-center gap-2 mb-6 text-sm text-slate-500 font-medium tracking-wide">
                    Made with <span className="text-pink-500 font-serif italic text-lg relative top-[1px]">Liebe</span> by <a href="https://portfolio-theta-lemon-33.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-primary hover:underline underline-offset-4 transition-all">Hrishi Mehta</a>
                </p>
                <div className="flex items-center justify-center gap-8 opacity-40 hover:opacity-80 transition-opacity duration-500">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-400" xmlns="http://www.w3.org/2000/svg"><title>OpenAI icon</title><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" /></svg>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-green-400/50 group-hover:text-green-400 transition-colors">OpenAI</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C12 2 13.5 10 22 12C13.5 14 12 22 12 22C12 22 10.5 14 2 12C10.5 10 12 2 12 2Z" fill="url(#geminiGradient)" />
                                <defs>
                                    <linearGradient id="geminiGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#4E75F6" />
                                        <stop offset="1" stopColor="#E3516F" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-blue-400/50 group-hover:text-blue-400 transition-colors">Google</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.218 2H11.62L16 12.987H13.598L9.218 2ZM4.379 2H6.891L11.271 12.987H8.82L7.925 10.679H3.345L2.449 12.986H0L4.379 2.001ZM7.134 8.64L5.635 4.777L4.137 8.64H7.134Z" fill="currentColor" className="text-amber-400" />
                            </svg>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-amber-400/50 group-hover:text-amber-400 transition-colors">Anthropic</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-colors">
                            <svg width="28" height="20" viewBox="0 0 365 258" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="Mistral AI Logo">
                                    <path d="M104.107 0H52.0525V51.57H104.107V0Z" fill="#FFD800" />
                                    <path d="M312.351 0H260.296V51.57H312.351V0Z" fill="#FFD800" />
                                    <path d="M156.161 51.5701H52.0525V103.14H156.161V51.5701Z" fill="#FFAF00" />
                                    <path d="M312.353 51.5701H208.244V103.14H312.353V51.5701Z" fill="#FFAF00" />
                                    <path d="M312.356 103.14H52.0525V154.71H312.356V103.14Z" fill="#FF8205" />
                                    <path d="M104.107 154.71H52.0525V206.28H104.107V154.71Z" fill="#FA500F" />
                                    <path d="M208.228 154.711H156.174V206.281H208.228V154.711Z" fill="#FA500F" />
                                    <path d="M312.351 154.711H260.296V206.281H312.351V154.711Z" fill="#FA500F" />
                                    <path d="M156.195 206.312H0V257.882H156.195V206.312Z" fill="#E10500" />
                                    <path d="M364.439 206.312H208.244V257.882H364.439V206.312Z" fill="#E10500" />
                                </g>
                            </svg>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-red-400/50 group-hover:text-red-400 transition-colors">Mistral</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                            <Zap size={20} className="text-orange-400" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-orange-400/50 group-hover:text-orange-400 transition-colors">Groq</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                            <img src="/openrouter.png" alt="OpenRouter" width={20} height={20} className="opacity-70 group-hover:opacity-100" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-indigo-400/50 group-hover:text-indigo-400 transition-colors">OpenRouter</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="p-3 bg-slate-500/10 rounded-xl group-hover:bg-slate-500/20 transition-colors">
                            <img src="/grok.png" alt="Grok" width={20} height={20} className="opacity-70 group-hover:opacity-100 invert" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400/50 group-hover:text-slate-400 transition-colors">Grok</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
