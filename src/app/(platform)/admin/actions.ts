"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  draftOf,
  normalizeDraft,
  validateDraft,
  type SaveState,
} from "@/lib/module-schema";
import { draftToRow } from "@/lib/modules";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";

/**
 * Server Actions are reachable by direct POST, so every one of them re-checks
 * that the caller is an admin even though row level security also enforces it.
 */
async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured, so modules cannot be edited.");
  }

  const viewer = await getViewer();

  if (!viewer.id) redirect("/sign-in?next=/admin");
  if (!viewer.isAdmin) throw new Error("You do not have admin access.");

  return createClient();
}

function refreshModuleRoutes(moduleId?: string) {
  revalidatePath("/", "layout");
  if (moduleId) revalidatePath(`/course/${moduleId}`, "layout");
}

export async function saveModule(
  _previous: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const supabase = await requireAdmin();

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { status: "error", message: "The module could not be read.", errors: [] };
  }

  const draft = normalizeDraft(draftOf(parsed));
  const errors = validateDraft(draft);

  if (errors.length > 0) {
    return {
      status: "error",
      message: "Fix the highlighted fields before saving.",
      errors,
    };
  }

  const originalId = String(formData.get("originalId") ?? "");
  const isNew = originalId === "";

  if (isNew) {
    const { data: existing } = await supabase
      .from("modules")
      .select("id")
      .eq("id", draft.id)
      .maybeSingle();

    if (existing) {
      return {
        status: "error",
        message: "That URL slug is already taken.",
        errors: [`A module with the slug "${draft.id}" already exists.`],
      };
    }

    const { error } = await supabase.from("modules").insert(draftToRow(draft));

    if (error) {
      return { status: "error", message: `Could not create the module: ${error.message}`, errors: [] };
    }

    refreshModuleRoutes(draft.id);
    redirect(`/admin/modules/${draft.id}?created=1`);
  }

  // The slug is part of every lesson URL and of saved progress rows, so it is
  // fixed once a module exists. The editor renders it read-only to match.
  const { error } = await supabase
    .from("modules")
    .update(draftToRow({ ...draft, id: originalId }))
    .eq("id", originalId);

  if (error) {
    return { status: "error", message: `Could not save the module: ${error.message}`, errors: [] };
  }

  refreshModuleRoutes(originalId);

  return { status: "success", message: "Module saved.", errors: [] };
}

export async function setModulePublished(formData: FormData) {
  const supabase = await requireAdmin();
  const moduleId = String(formData.get("moduleId") ?? "");
  const published = formData.get("published") === "true";

  const { error } = await supabase
    .from("modules")
    .update({ published })
    .eq("id", moduleId);

  if (error) throw new Error(`Could not update the module: ${error.message}`);

  refreshModuleRoutes(moduleId);
}

export async function deleteModule(formData: FormData) {
  const supabase = await requireAdmin();
  const moduleId = String(formData.get("moduleId") ?? "");

  const { error } = await supabase.from("modules").delete().eq("id", moduleId);

  if (error) throw new Error(`Could not delete the module: ${error.message}`);

  refreshModuleRoutes(moduleId);
  redirect("/admin?deleted=1");
}
