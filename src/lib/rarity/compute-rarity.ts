import type { VinylFinish, VinylRarity } from "@/types/vinyl";

export interface RarityInput {
  hasStreaming: boolean;
  hasVerifiedPurchase: boolean;
  isLimitedEdition?: boolean;
}

export interface RarityResult {
  rarity: VinylRarity;
  finish: VinylFinish;
}

const RARE_FINISHES: VinylFinish[] = ["translucent", "marble", "gold"];
const LEGENDARY_FINISHES: VinylFinish[] = [
  "translucent",
  "marble",
  "gold",
  "splatter",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Calcula rareza y acabado según la fuente de propiedad del usuario.
 * - Solo streaming → Común (negro estándar)
 * - Compra verificada → Rara (acabado especial aleatorio)
 * - Compra verificada + edición limitada → Legendaria (acabado premium)
 */
export function computeVinylRarity(input: RarityInput): RarityResult {
  const { hasStreaming, hasVerifiedPurchase, isLimitedEdition = false } = input;

  if (hasVerifiedPurchase) {
    if (isLimitedEdition) {
      return {
        rarity: "legendary",
        finish: pickRandom(LEGENDARY_FINISHES),
      };
    }
    return {
      rarity: "rare",
      finish: pickRandom(RARE_FINISHES),
    };
  }

  if (hasStreaming) {
    return { rarity: "common", finish: "standard_black" };
  }

  return { rarity: "common", finish: "standard_black" };
}

/** Determina si un vinilo existente debe mejorar tras nueva verificación */
export function shouldUpgradeRarity(
  current: VinylRarity,
  next: VinylRarity
): boolean {
  const order: Record<VinylRarity, number> = {
    common: 0,
    rare: 1,
    legendary: 2,
  };
  return order[next] > order[current];
}
