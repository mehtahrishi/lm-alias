"use client";

import { useEffect, useState } from "react";
import { AIModel } from "@/types";
import { ModelCard } from "@/components/ModelCard";
import { OnboardingView } from "@/components/OnboardingView";
import { ChatModal } from "@/components/ChatModal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Swords, ArrowRight } from "lucide-react";

export default function Home() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [activeModel, setActiveModel] = useState<AIModel | null>(null);
  const [loading, setLoading] = useState(false); // Do not load initially
  const [question, setQuestion] = useState("");
  const [stage, setStage] = useState<"auth" | "discovery">("auth");
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("OpenAI");

  const handleConnect = (key: string, provider: string) => {
    setApiKey(key);
    setProvider(provider);
    setLoading(true);
    setStage("discovery");

    // Simulate fetching based on Key
    fetch(`http://localhost:8000/discovery/models?provider=${provider}`, {
      headers: {
        "X-API-Key": key
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch models", err);
        setLoading(false);
      });
  };

  const toggleModel = (model: AIModel) => {
    const next = new Set(selectedModels);
    if (next.has(model.id)) {
      next.delete(model.id);
    } else {
      next.add(model.id);
    }
    setSelectedModels(next);
  };

  if (stage === "auth") {
    return (
      <main className="min-h-screen p-8 max-w-7xl mx-auto flex items-center justify-center">
        <OnboardingView onConnect={handleConnect} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-32 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-block p-1 px-3 mb-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          Provider: {provider}
        </div>
        <h1 className="text-6xl font-black tracking-tight mb-4">
          <span className="text-white">AI</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"> Wallet</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Securely discovered {models.length} available models from your API key.
        </p>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="text-center text-slate-500 animate-pulse">Scanning frequencies for AI signals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={activeModel?.id === model.id}
              onToggle={() => setActiveModel(model)}
            />
          ))}

          {models.length === 0 && (
            <div className="col-span-full text-center p-12 glass-card rounded-2xl border-dashed border-white/10 text-slate-500">
              No models found or API key invalid.
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Disconnect"
        >
          <ArrowRight className="rotate-180" size={20} />
        </button>
      </div>

      <AnimatePresence>
        {activeModel && (
          <ChatModal
            model={activeModel}
            apiKey={apiKey}
            provider={provider}
            onClose={() => setActiveModel(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
