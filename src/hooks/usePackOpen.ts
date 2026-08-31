"use client";

import { useState, useCallback } from "react";
import type { PackOpenResult } from "@/types/vinyl";

export function usePackOpen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPack = useCallback(async (): Promise<PackOpenResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/packs/open", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to open pack");
      }
      const data = await res.json();
      return {
        vinyl: data.vinyl,
        isNew: true,
        upgraded: false,
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { openPack, loading, error };
}
