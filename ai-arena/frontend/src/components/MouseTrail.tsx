"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Point {
    x: number;
    y: number;
    id: number;
    color: string;
}

export const MouseTrail = () => {
    const [points, setPoints] = useState<Point[]>([]);

    useEffect(() => {
        let counter = 0;
        const colors = ["#38bdf8", "#c084fc", "#22d3ee", "#e879f9"]; // Theme colors

        const handleMouseMove = (e: MouseEvent) => {
            const newPoint = {
                x: e.clientX,
                y: e.clientY,
                id: counter++,
                color: colors[Math.floor(Math.random() * colors.length)]
            };

            setPoints(prev => [...prev.slice(-20), newPoint]); // Keep last 20 points
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-50">
            <AnimatePresence>
                {points.map((point) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            left: point.x,
                            top: point.y,
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            backgroundColor: point.color,
                            transform: "translate(-50%, -50%)",
                            boxShadow: `0 0 10px ${point.color}`
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
