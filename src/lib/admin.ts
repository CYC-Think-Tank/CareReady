import "server-only";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getViewer } from "@/lib/viewer";

export type AdminGate =
  | { allowed: true; blocked: null }
  | { allowed: false; blocked: "unconfigured" | "forbidden" };

/**
 * Admin pages explain why access was refused rather than 404ing, so the person
 * setting the project up can tell "not signed in as an admin" apart from
 * "Supabase isn't wired up yet".
 */
export async function checkAdminAccess(returnTo = "/admin"): Promise<AdminGate> {
  if (!isSupabaseConfigured()) {
    return { allowed: false, blocked: "unconfigured" };
  }

  const viewer = await getViewer();

  if (!viewer.id) {
    redirect(`/sign-in?next=${encodeURIComponent(returnTo)}`);
  }

  if (!viewer.isAdmin) {
    return { allowed: false, blocked: "forbidden" };
  }

  return { allowed: true, blocked: null };
}
