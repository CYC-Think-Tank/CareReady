import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string | null;
  email: string | null;
  fullName: string;
  profession: string;
  isDemo: boolean;
};

export async function getViewer(): Promise<Viewer> {
  if (!isSupabaseConfigured()) {
    return {
      id: null,
      email: null,
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
      email: null,
      fullName: "Guest learner",
      profession: "Healthcare professional",
      isDemo: false,
    };
  }

  const metadata = (claims.user_metadata ?? {}) as Record<string, unknown>;

  return {
    id: String(claims.sub),
    email: typeof claims.email === "string" ? claims.email : null,
    fullName:
      typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof claims.email === "string"
          ? claims.email.split("@")[0]
          : "Learner",
    profession:
      typeof metadata.profession === "string"
        ? metadata.profession
        : "Healthcare professional",
    isDemo: false,
  };
}
