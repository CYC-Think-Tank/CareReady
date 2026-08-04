import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string | null;
  username: string | null;
  fullName: string;
  profession: string;
  isDemo: boolean;
};

export async function getViewer(): Promise<Viewer> {
  if (!isSupabaseConfigured()) {
    return {
      id: null,
      username: "alex.morgan",
      fullName: "Alex Morgan",
      profession: "Personal Support Worker",
      isDemo: true,
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
    };
  }

  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>;

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
  };
}
