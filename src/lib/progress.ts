import "server-only";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type ProgressRecord = {
  module_id: string;
  lesson_id: string;
  completed: boolean;
  score: number | null;
};

const demoProgress: ProgressRecord[] = [
  {
    module_id: "skin-changes",
    lesson_id: "observe",
    completed: true,
    score: null,
  },
];

export async function getProgress(userId: string | null) {
  if (!isSupabaseConfigured()) {
    return demoProgress;
  }

  if (!userId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("module_id, lesson_id, completed, score")
    .eq("user_id", userId);

  if (error) {
    console.error("Unable to load learner progress", error.message);
    return [];
  }

  return data as ProgressRecord[];
}
