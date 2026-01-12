"use client";

import { AIModel } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Zap, Brain, Cpu, Server } from "lucide-react";
import React from "react";

interface ModelCardProps {
    model: AIModel;
    isSelected: boolean;
    onToggle: (model: AIModel) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, isSelected, onToggle }) => {
    const isSmart = model.category === "SMART";
    const isFast = model.category === "FAST";

    return (
        <motion.div
            onClick={() => onToggle(model)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative group cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300",
                isSelected
                    ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-primary"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 glass-card"
            )}
        >
            {/* Background Gradient Effect */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                "bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"
            )} />

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        model.provider === "OpenAI" ? "bg-green-500/20 text-green-400" :
                            model.provider === "Google" ? "bg-blue-500/20 text-blue-400" :
                                model.provider === "Anthropic" ? "bg-amber-500/20 text-amber-400" :
                                    "bg-purple-500/20 text-purple-400"
                    )}>
                        {model.provider === "OpenAI" ? <Zap size={20} /> :
                            model.provider === "Google" ? <Brain size={20} /> :
                                <Server size={20} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white leading-tight">{model.name}</h3>
                        <span className="text-xs text-slate-400">{model.provider}</span>
                    </div>
                </div>

                <div className={cn(
                    "h-6 w-6 rounded-full border border-white/10 flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary border-primary text-black" : "bg-transparent text-transparent"
                )}>
                    <Check size={14} strokeWidth={3} />
                </div>
            </div>

            <p className="text-sm text-slate-400 mb-4 line-clamp-2 h-10">
                {model.description || "A powerful AI model ready for evaluation."}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
                <Badge variant={isSmart ? "default" : isFast ? "success" : "secondary"}>
                    {model.category}
                </Badge>
                <Badge variant="outline" className="border-white/10 text-slate-300">
                    {model.context_window / 1000}k Context
                </Badge>
            </div>
        </motion.div>
    );
};
