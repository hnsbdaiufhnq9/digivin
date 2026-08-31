"use client";

import { VinylCard } from "./VinylCard";
import type { UserVinyl } from "@/types/vinyl";

interface VinylGridProps {
  vinyls: UserVinyl[];
}

export function VinylGrid({ vinyls }: VinylGridProps) {
  if (vinyls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-crate-border py-16 text-center">
        <span className="mb-3 text-4xl">💿</span>
        <p className="text-sm text-zinc-400">
          Tu estantería está vacía.
          <br />
          Conecta tu streaming o abre un sobre.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {vinyls.map((vinyl) => (
        <div key={vinyl.id} className="flex flex-col items-center gap-2">
          <VinylCard vinyl={vinyl} size="sm" />
          <div className="w-full text-center">
            <p className="truncate text-xs font-medium text-zinc-300">
              {vinyl.album?.title}
            </p>
            <p className="truncate text-[10px] text-zinc-500">
              {vinyl.album?.artist_name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
