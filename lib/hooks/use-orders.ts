"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  type CreateOrderInput,
  type AdminOrderFilters,
} from "@/services/orders";
import { saveAddress } from "@/services/addresses";
import type { Order } from "@/types";

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const supabase = createClient();
      await saveAddress(supabase, input.userId, input.shippingAddress);
      return createOrder(supabase, input);
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(createClient(), orderId),
    enabled: Boolean(orderId),
  });
}

export function useAdminOrders(filters: AdminOrderFilters) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => getAllOrders(createClient(), filters),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      paymentStatus,
    }: {
      orderId: string;
      status?: Order["status"];
      paymentStatus?: Order["payment_status"];
    }) => updateOrderStatus(createClient(), orderId, { status, paymentStatus }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
    },
  });
}
