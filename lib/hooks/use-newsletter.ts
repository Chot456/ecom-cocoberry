"use client";

import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { subscribeToNewsletter } from "@/services/newsletter";

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (email: string) => subscribeToNewsletter(createClient(), email),
  });
}
