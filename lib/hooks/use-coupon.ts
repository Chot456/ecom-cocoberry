"use client";

import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { validateCoupon } from "@/services/coupons";

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, orderAmount }: { code: string; orderAmount: number }) =>
      validateCoupon(createClient(), code, orderAmount),
  });
}
