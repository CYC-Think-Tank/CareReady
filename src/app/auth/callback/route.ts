import { NextResponse, type NextRequest } from "next/server";

import { safeRedirectPath } from "@/lib/safe-redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeRedirectPath(
    request.nextUrl.searchParams.get("next"),
    "/dashboard",
  );

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/sign-in?error=confirmation", request.url));
}
