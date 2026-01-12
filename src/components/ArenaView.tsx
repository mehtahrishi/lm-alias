"use client";

import { AIModel, EvaluationResult } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Trophy, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ArenaViewProps {
    question: string;
    models: AIModel[];
    onBack: () => void;
    apiKey: string;
    provider: string;
}

interface ModelResponse {
    modelId: string;
    text: string;
    status: "pending" | "generating" | "completed" | "error";
    duration: number;
}

export const ArenaView: React.FC<ArenaViewProps> = ({ question, models, onBack, apiKey, provider }) => {
    const [responses, setResponses] = useState<Record<string, ModelResponse>>({});
    const [results, setResults] = useState<EvaluationResult[] | null>(null);
    const [status, setStatus] = useState<"fighting" | "judging" | "done">("fighting");

    useEffect(() => {
        // init responses
        const initial: Record<string, ModelResponse> = {};
        models.forEach(m => {
            initial[m.id] = { modelId: m.id, text: "", status: "pending", duration: 0 };
        });
        setResponses(initial);

        // Call Backend for Real Streaming
        const activePromises = models.map(async (model) => {
            setResponses(prev => ({
                ...prev,
                [model.id]: { ...prev[model.id], status: "generating" }
            }));

            const startTime = Date.now();

            try {
                const response = await fetch("http://localhost:8000/generation/stream", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model_id: model.id,
                        provider: provider,
                        prompt: question,
                        api_key: apiKey
                    })
                });

                if (!response.body) return;
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    fullText += chunk;

                    setResponses(prev => ({
                        ...prev,
                        [model.id]: { ...prev[model.id], text: fullText }
                    }));
                }

                const duration = (Date.now() - startTime) / 1000;
                setResponses(prev => ({
                    ...prev,
                    [model.id]: { ...prev[model.id], status: "completed", duration }
                }));

            } catch (e) {
                console.error(e);
                setResponses(prev => ({
                    ...prev,
                    [model.id]: { ...prev[model.id], text: "Error generating response", status: "error" }
                }));
            }
        });

        // When all done, move to judging (currently mocked, but could be real too)
        Promise.all(activePromises).then(() => {
            setTimeout(() => setStatus("judging"), 1000);
            // Mock Judging block remains...
            setTimeout(() => {
                const mockResults = models.map(m => ({
                    model_id: m.id,
                    scores: {
                        correctness: Math.floor(Math.random() * 3) + 7,
                        clarity: Math.floor(Math.random() * 3) + 7,
                        relevance: Math.floor(Math.random() * 3) + 7,
                        brevity: Math.floor(Math.random() * 3) + 7,
                    },
                    explanation: "Good response.",
                    total_score: Math.random() * 2 + 7.5
                })).sort((a, b) => b.total_score - a.total_score);

                setResults(mockResults);
                setStatus("done");
            }, 4000);
        });

    }, [models, question, apiKey, provider]);

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft size={16} /> Back to Selection
            </button>

            {/* Question Header */}
            <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl mb-8 flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Prompt</h2>
                    <p className="text-xl text-white font-medium">{question}</p>
                </div>
            </div>

            {/* Battle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {models.map(model => {
                    const resp = responses[model.id] || { text: "", status: "pending" };
                    const result = results?.find(r => r.model_id === model.id);
                    const isWinner = results && results[0].model_id === model.id;

                    return (
                        <div key={model.id} className={cn(
                            "flex flex-col rounded-xl border bg-slate-900/50 overflow-hidden relative transition-all",
                            isWinner ? "border-yellow-500/50 ring-1 ring-yellow-500/20" : "border-white/10"
                        )}>
                            {isWinner && (
                                <div className="absolute top-0 right-0 p-2 bg-yellow-500/20 rounded-bl-xl text-yellow-500 z-10">
                                    <Trophy size={20} />
                                </div>
                            )}

                            {/* Header */}
                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <span className="font-bold">{model.name}</span>
                                <Badge variant={resp.status === "completed" ? "outline" : "secondary"}>
                                    {resp.status === "pending" ? "Waiting..." :
                                        resp.status === "generating" ? "Generating..." :
                                            `${resp.duration.toFixed(2)}s`}
                                </Badge>
                            </div>

                            {/* Body */}
                            <div className="p-4 h-64 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-slate-300">
                                {resp.text || <span className="text-slate-600 animate-pulse">Waiting for stream...</span>}
                                {resp.status === "generating" && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />}
                            </div>

                            {/* Score Footer */}
                            {status === "done" && result && (
                                <div className="p-4 border-t border-white/10 bg-black/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-400">Total Score</span>
                                        <span className="text-xl font-bold text-white">{result.total_score.toFixed(1)}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 text-center">
                                        {Object.entries(result.scores).map(([key, score]) => (
                                            <div key={key} className="bg-white/5 rounded p-1">
                                                <div className="text-[10px] text-slate-500 uppercase">{key.slice(0, 3)}</div>
                                                <div className={cn("text-sm font-bold", score > 8 ? "text-green-400" : "text-yellow-400")}>{score}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {status === "judging" && (
                <div className="fixed bottom-0 left-0 w-full p-6 bg-slate-950/80 backdrop-blur border-t border-white/10 flex justify-center items-center gap-3 text-cyan-400">
                    <Loader2 className="animate-spin" />
                    <span className="font-mono text-lg font-bold">AI Judge Evaluator 9000 is analyzing results...</span>
                </div>
            )}

        </div>
    );
}
