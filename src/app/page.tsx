"use client";

import { useEffect, useState } from "react";
import { AIModel } from "@/types";
import { ModelCard } from "@/components/ModelCard";
import { ArenaView } from "@/components/ArenaView";
import { OnboardingView } from "@/components/OnboardingView";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Swords } from "lucide-react";

export default function Home() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false); // Do not load initially
  const [question, setQuestion] = useState("");
  const [stage, setStage] = useState<"auth" | "discovery" | "arena">("auth");
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

  const startRound = () => {
    if (selectedModels.size > 0 && question.trim()) {
      setStage("arena");
      console.log("Starting round with:", Array.from(selectedModels));
    }
  };

  if (stage === "auth") {
    return (
      <main className="min-h-screen p-8 max-w-7xl mx-auto flex items-center justify-center">
        <OnboardingView onConnect={handleConnect} />
      </main>
    );
  }

  if (stage === "arena") {
    const selectedList = models.filter(m => selectedModels.has(m.id));
    return (
      <ArenaView
        question={question}
        models={selectedList}
        onBack={() => setStage("discovery")}
        apiKey={apiKey}
        provider={provider}
      />
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
          Live Multi-Model Evaluation
        </div>
        <h1 className="text-6xl font-black tracking-tight mb-4">
          <span className="text-white">AI</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"> Arena</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Discover, Compare, and Rank the world's best AI models in real-time.
          Select your fighters below to begin the evaluation.
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
              isSelected={selectedModels.has(model.id)}
              onToggle={toggleModel}
            />
          ))}
        </div>
      )}

      {/* Controls Sticky Footer */}
      <AnimatePresence>
        {selectedModels.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl p-4 md:p-6"
          >
            <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-2xl border-t border-white/10 ring-1 ring-white/5">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Type a question to test the models (e.g., 'Explain Quantum Computing in 5 words')..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
              <button
                onClick={startRound}
                disabled={!question.trim()}
                className={cn(
                  "h-12 px-8 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 whitespace-nowrap",
                  question.trim()
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/25 text-white"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                )}
              >
                <Swords size={20} />
                Start Round ({selectedModels.size})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State Helper */}
      {selectedModels.size === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-10 left-0 w-full text-center pointer-events-none text-slate-500"
        >
          Select at least one model to enable the prompt input.
        </motion.div>
      )}
    </main>
  );
}
