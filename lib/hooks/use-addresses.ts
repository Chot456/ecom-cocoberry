"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getDefaultAddress } from "@/services/addresses";

export function useDefaultAddress(userId?: string) {
  return useQuery({
    queryKey: ["address", "default", userId],
    queryFn: () => getDefaultAddress(createClient(), userId!),
    enabled: Boolean(userId),
  });
}
