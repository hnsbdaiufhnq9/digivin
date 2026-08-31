"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserVinyl } from "@/types/vinyl";

export function useCollection() {
  const [vinyls, setVinyls] = useState<UserVinyl[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_vinyls")
      .select("*, album:albums(*)")
      .order("acquired_at", { ascending: false });

    setVinyls((data as UserVinyl[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { vinyls, loading, refetch: fetchCollection };
}
