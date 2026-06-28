import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Coupon } from "@/types";

type Client = SupabaseClient<Database>;

export async function validateCoupon(supabase: Client, code: string, orderAmount: number) {
  const { data, error } = await supabase
    .rpc("validate_coupon", { coupon_code: code, order_amount: orderAmount })
    .single();
  if (error) throw error;
  return data as { valid: boolean; message: string; discount_amount: number };
}

export async function getCoupons(supabase: Client): Promise<Coupon[]> {
  const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCouponById(supabase: Client, id: string): Promise<Coupon | null> {
  const { data, error } = await supabase.from("coupons").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export interface CouponInput {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxUses: number | null;
  active: boolean;
  expiresAt: string | null;
}

function toCouponRow(input: CouponInput) {
  return {
    code: input.code,
    discount_type: input.discountType,
    discount_value: input.discountValue,
    min_order_amount: input.minOrderAmount,
    max_uses: input.maxUses,
    active: input.active,
    expires_at: input.expiresAt,
  };
}

export async function createCoupon(supabase: Client, input: CouponInput): Promise<string> {
  const { data, error } = await supabase.from("coupons").insert(toCouponRow(input)).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function updateCoupon(supabase: Client, id: string, input: CouponInput): Promise<void> {
  const { error } = await supabase.from("coupons").update(toCouponRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteCoupon(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}
