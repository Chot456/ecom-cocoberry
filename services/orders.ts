import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { CartItem, Order, OrderItem, PaymentMethod, ShippingAddressInput } from "@/types";

type Client = SupabaseClient<Database>;

export interface CreateOrderInput {
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddressInput;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export async function createOrder(supabase: Client, input: CreateOrderInput) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      subtotal: input.subtotal,
      shipping_fee: input.shippingFee,
      discount: input.discount,
      total: input.total,
      payment_method: input.paymentMethod,
      shipping_address: { ...input.shippingAddress },
    })
    .select("id")
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  if (itemsError) throw itemsError;

  return order.id as string;
}

export async function getOrderById(supabase: Client, orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as (Order & { order_items: OrderItem[] }) | null;
}

export interface AdminOrderFilters {
  status?: Order["status"];
  page?: number;
  pageSize?: number;
}

export async function getAllOrders(
  supabase: Client,
  filters: AdminOrderFilters = {}
): Promise<{ orders: Order[]; count: number }> {
  const { status, page = 1, pageSize = 20 } = filters;

  let request = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) {
    request = request.eq("status", status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  request = request.range(from, to);

  const { data, error, count } = await request;
  if (error) throw error;

  return { orders: (data ?? []) as Order[], count: count ?? 0 };
}

export async function updateOrderStatus(
  supabase: Client,
  orderId: string,
  updates: { status?: Order["status"]; paymentStatus?: Order["payment_status"] }
): Promise<void> {
  const payload: Database["public"]["Tables"]["orders"]["Update"] = {};
  if (updates.status) payload.status = updates.status;
  if (updates.paymentStatus) payload.payment_status = updates.paymentStatus;

  const { error } = await supabase.from("orders").update(payload).eq("id", orderId);
  if (error) throw error;
}
