import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { ShippingAddressInput } from "@/types";

type Client = SupabaseClient<Database>;

export async function getDefaultAddress(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveAddress(
  supabase: Client,
  userId: string,
  input: ShippingAddressInput
) {
  const { count } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const { error } = await supabase.from("addresses").insert({
    user_id: userId,
    full_name: input.fullName,
    phone: input.phone,
    address: input.address,
    city: input.city,
    province: input.province,
    postal_code: input.postalCode,
    country: input.country,
    is_default: !count,
  });
  if (error) throw error;
}
