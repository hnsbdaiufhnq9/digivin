"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FINISH_CONFIG,
  RARITY_CONFIG,
  type UserVinyl,
} from "@/types/vinyl";

interface VinylCardProps {
  vinyl: UserVinyl;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  reveal?: boolean;
}

const SIZES = {
  sm: "h-24 w-24",
  md: "h-32 w-32",
  lg: "h-44 w-44",
};

export function VinylCard({
  vinyl,
  size = "md",
  onClick,
  reveal = false,
}: VinylCardProps) {
  const { rarity, finish, album } = vinyl;
  const rarityCfg = RARITY_CONFIG[rarity];
  const finishCfg = FINISH_CONFIG[finish];
  const coverUrl = album?.cover_url;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reveal ? { scale: 0.6, opacity: 0, rotateY: 180 } : false}
      animate={reveal ? { scale: 1, opacity: 1, rotateY: 0 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "group relative flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-crate-accent",
        SIZES[size]
      )}
    >
      {/* Disco de vinilo */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br vinyl-grooves ring-2 transition-transform group-hover:scale-105",
          finishCfg.gradient,
          finishCfg.ringColor,
          rarityCfg.glowClass
        )}
      >
        {/* Etiqueta central / portada */}
        <div className="absolute left-1/2 top-1/2 h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-black/40">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={album?.title ?? "Vinilo"}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-xs text-zinc-500">
              ?
            </div>
          )}
        </div>
        {/* Agujero central */}
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-crate-bg ring-1 ring-zinc-600" />
      </div>

      {/* Badge de rareza */}
      {rarity !== "common" && (
        <span
          className={cn(
            "absolute -right-1 -top-1 z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            rarity === "legendary"
              ? "bg-crate-gold text-black"
              : "bg-crate-accent text-white"
          )}
        >
          {rarity === "legendary" ? "★" : "◆"}
        </span>
      )}
    </motion.button>
  );
}
