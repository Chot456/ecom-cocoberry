"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { addToWishlist, getWishlist, isInWishlist, removeFromWishlist } from "@/services/wishlist";
import { useUser } from "@/lib/hooks/use-user";

export function useWishlist() {
  const { user } = useUser();
  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => getWishlist(createClient(), user!.id),
    enabled: Boolean(user),
  });
}

export function useIsWishlisted(productId: string) {
  const { user } = useUser();
  return useQuery({
    queryKey: ["wishlist", "check", user?.id, productId],
    queryFn: () => isInWishlist(createClient(), user!.id, productId),
    enabled: Boolean(user) && Boolean(productId),
  });
}

export function useToggleWishlist() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isWishlisted }: { productId: string; isWishlisted: boolean }) => {
      if (!user) throw new Error("Sign in to use your wishlist.");
      const supabase = createClient();
      if (isWishlisted) {
        await removeFromWishlist(supabase, user.id, productId);
      } else {
        await addToWishlist(supabase, user.id, productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
