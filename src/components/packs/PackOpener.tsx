"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SleeveAnimation } from "./SleeveAnimation";
import { VinylCard } from "@/components/collection/VinylCard";
import type { UserVinyl } from "@/types/vinyl";

interface PackOpenerProps {
  packName: string;
  creditsCost: number;
}

type Phase = "idle" | "opening" | "revealed";

// Resultado demo — sustituir por API /packs/open
const DEMO_REVEAL: UserVinyl = {
  id: "new-1",
  user_id: "demo",
  album_id: "a4",
  rarity: "rare",
  finish: "marble",
  unlocked_via: "pack",
  acquired_at: new Date().toISOString(),
  album: {
    id: "a4",
    title: "Currents",
    artist_name: "Tame Impala",
    release_year: 2015,
    cover_url: "https://i.scdn.co/image/ab67616d0000b273artwork",
    spotify_album_id: null,
    apple_music_album_id: null,
    genre: "Psychedelic",
  },
};

export function PackOpener({ packName, creditsCost }: PackOpenerProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState<UserVinyl | null>(null);

  const handleOpen = () => {
    setPhase("opening");
  };

  const handleRevealComplete = () => {
    setRevealed(DEMO_REVEAL);
    setPhase("revealed");
  };

  const handleReset = () => {
    setPhase("idle");
    setRevealed(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="pack-idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex w-full flex-col items-center gap-4"
          >
            {/* Funda exterior del sobre */}
            <div className="relative h-52 w-40 rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-2xl ring-1 ring-zinc-600">
              <div className="absolute inset-x-3 top-3 h-8 rounded bg-zinc-800/80" />
              <p className="absolute inset-x-0 bottom-6 text-center text-display text-sm font-semibold text-zinc-300">
                {packName}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpen}
              className="w-full rounded-xl bg-crate-accent py-3.5 text-sm font-semibold text-white transition hover:bg-purple-600 active:scale-[0.98]"
            >
              Abrir sobre · {creditsCost} crédito
            </button>
          </motion.div>
        )}

        {phase === "opening" && (
          <SleeveAnimation
            key="pack-opening"
            onComplete={handleRevealComplete}
          />
        )}

        {phase === "revealed" && revealed && (
          <motion.div
            key="pack-revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full flex-col items-center gap-5"
          >
            <p className="text-display text-lg font-semibold text-crate-gold">
              ¡Nuevo vinilo!
            </p>
            <VinylCard vinyl={revealed} size="lg" reveal />
            <div className="text-center">
              <p className="font-medium text-white">{revealed.album?.title}</p>
              <p className="text-sm text-zinc-400">{revealed.album?.artist_name}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-crate-accent">
                {revealed.rarity === "rare" ? "Edición Coleccionista" : revealed.rarity}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-zinc-400 underline hover:text-zinc-200"
            >
              Abrir otro
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
