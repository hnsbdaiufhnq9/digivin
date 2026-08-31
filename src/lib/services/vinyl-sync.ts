import type { UserVinyl } from "@/types/vinyl";
import { computeVinylRarity, shouldUpgradeRarity } from "@/lib/rarity/compute-rarity";

export interface SyncVinylInput {
  userId: string;
  albumId: string;
  hasStreaming: boolean;
  hasVerifiedPurchase: boolean;
  isLimitedEdition?: boolean;
  unlockedVia: UserVinyl["unlocked_via"];
}

/**
 * Servicio de dominio: determina rareza y decide si crear o mejorar un vinilo.
 */
export function resolveVinylState(input: SyncVinylInput, existing?: UserVinyl | null) {
  const next = computeVinylRarity({
    hasStreaming: input.hasStreaming,
    hasVerifiedPurchase: input.hasVerifiedPurchase,
    isLimitedEdition: input.isLimitedEdition,
  });

  if (!existing) {
    return { action: "create" as const, ...next, unlockedVia: input.unlockedVia };
  }

  if (shouldUpgradeRarity(existing.rarity, next.rarity)) {
    return { action: "upgrade" as const, ...next, unlockedVia: input.unlockedVia };
  }

  return { action: "noop" as const, rarity: existing.rarity, finish: existing.finish, unlockedVia: existing.unlocked_via };
}
