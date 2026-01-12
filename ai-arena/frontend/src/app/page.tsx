"use client";

import { useState, useEffect } from "react";
import { AIModel } from "@/types";
import { ModelCard } from "@/components/ModelCard";
import { OnboardingView } from "@/components/OnboardingView";
import { ChatModal } from "@/components/ChatModal";
import { Sparkles, Wallet, Search, LogOut } from "lucide-react";

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

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-primary to-purple-500 p-2.5 rounded-xl shadow-lg shadow-primary/20">
                        <Wallet className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            AI Wallet
                        </h1>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Know the models your API holds</p>
                    </div>
                </div>

                {stage === "discovery" && (
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white flex items-center gap-2 group"
                    >
                        <span className="text-sm font-medium hidden md:block">Exit Wallet</span>
                        <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
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
        </main>
    );
}
