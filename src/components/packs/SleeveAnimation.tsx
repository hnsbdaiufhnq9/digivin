"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface SleeveAnimationProps {
  onComplete: () => void;
  durationMs?: number;
}

/**
 * Animación de extracción de funda interior — el vinilo emerge
 * del sobre como si se deslizara fuera de una funda de papel.
 */
export function SleeveAnimation({
  onComplete,
  durationMs = 2200,
}: SleeveAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, durationMs);
    return () => clearTimeout(timer);
  }, [onComplete, durationMs]);

  return (
    <div className="relative flex h-64 w-full items-center justify-center overflow-hidden">
      {/* Tocadiscos / plato giratorio de fondo */}
      <motion.div
        className="absolute h-56 w-56 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 vinyl-grooves ring-2 ring-zinc-700"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crate-bg" />
      </motion.div>

      {/* Funda exterior que se abre */}
      <motion.div
        className="absolute z-10 h-48 w-36 origin-bottom rounded-lg bg-gradient-to-b from-amber-900/80 to-amber-950 shadow-xl"
        initial={{ scaleY: 1, opacity: 1 }}
        animate={{ scaleY: 0.3, opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeIn" }}
      />

      {/* Vinilo que emerge */}
      <motion.div
        className="relative z-20 h-36 w-36 rounded-full bg-gradient-to-br from-violet-600/60 via-fuchsia-500/40 to-transparent vinyl-grooves ring-2 ring-violet-400/50 shadow-[0_0_32px_rgba(168,85,247,0.5)]"
        initial={{ y: 60, scale: 0.5, opacity: 0 }}
        animate={{ y: -20, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 }}
      >
        <div className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800 ring-2 ring-black/30" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crate-bg" />
      </motion.div>

      {/* Partículas / brillo */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-crate-gold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: Math.cos(i * 60 * (Math.PI / 180)) * 80,
            y: Math.sin(i * 60 * (Math.PI / 180)) * 80,
          }}
          transition={{ duration: 1.2, delay: 1 + i * 0.08 }}
        />
      ))}
    </div>
  );
}
