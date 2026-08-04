import "server-only";

import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string | null;
  username: string | null;
  fullName: string;
  profession: string;
  isDemo: boolean;
  isAdmin: boolean;
};

export const getViewer = cache(async (): Promise<Viewer> => {
  if (!isSupabaseConfigured()) {
    return {
      id: null,
      username: "alex.morgan",
      fullName: "Alex Morgan",
      profession: "Personal Support Worker",
      isDemo: true,
      isAdmin: false,
    };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return {
      id: null,
      username: null,
      fullName: "Guest learner",
      profession: "Healthcare professional",
      isDemo: false,
      isAdmin: false,
    };
  }

  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: String(claims.sub),
    username:
      typeof metadata.username === "string" ? metadata.username : null,
    fullName:
      typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.username === "string"
          ? metadata.username
          : "Learner",
    profession:
      typeof metadata.profession === "string"
        ? metadata.profession
        : "Healthcare professional",
    isDemo: false,
    isAdmin: profile?.is_admin === true,
  };
});
