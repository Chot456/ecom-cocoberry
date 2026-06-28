import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") || "/account";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const profile = data.user ? await getProfile(supabase, data.user.id) : null;
      return NextResponse.redirect(`${origin}${profile?.role === "admin" ? "/admin" : redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
