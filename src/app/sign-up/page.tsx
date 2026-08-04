import type { Metadata } from "next";

import { AuthPage } from "@/components/auth-page";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return <AuthPage mode="sign-up" configured={isSupabaseConfigured()} />;
}

