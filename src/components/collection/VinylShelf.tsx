"use client";

import { VinylCard } from "./VinylCard";
import type { UserVinyl } from "@/types/vinyl";

interface VinylShelfProps {
  vinyls: UserVinyl[];
}

export function VinylShelf({ vinyls }: VinylShelfProps) {
  return (
    <div className="relative rounded-2xl border border-crate-border bg-crate-surface p-4 shelf-glow">
      {/* Estantería visual */}
      <div className="absolute inset-x-4 bottom-3 h-1 rounded-full bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent" />

      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
        {vinyls.map((vinyl, i) => (
          <div
            key={vinyl.id}
            className="flex flex-col items-center gap-2"
            style={{ transform: `translateY(${i % 2 === 0 ? 0 : 4}px)` }}
          >
            <VinylCard vinyl={vinyl} size="md" />
            <p className="max-w-[8rem] truncate text-center text-[11px] text-zinc-400">
              {vinyl.album?.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
