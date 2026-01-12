import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "destructive" | "success";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "default", ...props }) => {
    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            {
                "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
                "border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700": variant === "secondary",
                "text-slate-300 border-slate-700": variant === "outline",
                "border-transparent bg-red-500/20 text-red-500 hover:bg-red-500/30": variant === "destructive",
                "border-transparent bg-green-500/20 text-green-500 hover:bg-green-500/30": variant === "success",
            },
            className
        )} {...props} />
    );
};
