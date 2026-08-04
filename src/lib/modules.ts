import "server-only";

import { cache } from "react";

import {
  courseModules as fallbackModules,
  type CourseModule,
  type KnowledgeCheck,
  type Lesson,
  type LessonSection,
} from "@/content/course";
import {
  accentOf,
  emptyModuleDraft,
  informationOf,
  knowledgeCheckOf,
  type ModuleDraft,
} from "@/lib/module-schema";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type ModuleRow = {
  id: string;
  number: number;
  category: string | null;
  title: string;
  summary: string | null;
  minutes: number | null;
  accent: string | null;
  published: boolean;
  information: unknown;
  knowledge_check: unknown;
};

export const MODULE_COLUMNS =
  "id, number, category, title, summary, minutes, accent, published, information, knowledge_check";

function toDraft(row: ModuleRow): ModuleDraft {
  return {
    id: row.id,
    number: row.number,
    category: row.category ?? "",
    title: row.title,
    summary: row.summary ?? "",
    minutes: row.minutes ?? 0,
    accent: accentOf(row.accent),
    published: row.published,
    information: informationOf(row.information),
    knowledgeCheck: knowledgeCheckOf(row.knowledge_check),
  };
}

/** Splits a draft into the two jsonb columns the modules table stores. */
export function draftToRow(draft: ModuleDraft) {
  return {
    id: draft.id,
    number: draft.number,
    category: draft.category,
    title: draft.title,
    summary: draft.summary,
    minutes: draft.minutes,
    accent: draft.accent,
    published: draft.published,
    information: draft.information,
    knowledge_check: draft.knowledgeCheck,
  };
}

/** Projects a stored draft into the lesson shape the learner pages render. */
export function draftToCourseModule(draft: ModuleDraft): CourseModule {
  const sections: LessonSection[] = draft.information.sections.map((section) => ({
    heading: section.heading,
    body: section.body,
    ...(section.bullets.length > 0 ? { bullets: section.bullets } : {}),
    ...(section.note ? { note: section.note } : {}),
  }));

  const lessons: Lesson[] = [
    {
      id: draft.information.id,
      title: draft.information.title,
      eyebrow: draft.information.eyebrow,
      minutes: draft.information.minutes,
      intro: draft.information.intro,
      sections,
    },
  ];

  const check = draft.knowledgeCheck;

  if (check.prompt && check.options.length > 0) {
    const knowledgeCheck: KnowledgeCheck = {
      prompt: check.prompt,
      options: check.options,
      correctIndex: check.correctIndex,
      explanation: check.explanation,
    };

    lessons.push({
      id: check.id,
      title: check.title,
      eyebrow: check.eyebrow,
      minutes: check.minutes,
      intro: check.intro,
      sections: check.scenario ? [{ heading: "Scenario", body: check.scenario }] : [],
      knowledgeCheck,
    });
  }

  return {
    id: draft.id,
    number: draft.number,
    category: draft.category,
    title: draft.title,
    summary: draft.summary,
    minutes: draft.minutes,
    accent: draft.accent,
    lessons,
  };
}

export type ModuleSource = "database" | "fallback";

/**
 * Every module the current viewer may see: published modules for learners, plus
 * unpublished drafts for admins. Falls back to the bundled static content when
 * Supabase is unconfigured or the migration has not been applied yet.
 */
export const loadModules = cache(
  async (): Promise<{ drafts: ModuleDraft[]; source: ModuleSource }> => {
    if (!isSupabaseConfigured()) {
      return { drafts: fallbackDrafts(), source: "fallback" };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("modules")
      .select(MODULE_COLUMNS)
      .order("number", { ascending: true });

    if (error) {
      console.error("Unable to load modules, using bundled content", error.message);
      return { drafts: fallbackDrafts(), source: "fallback" };
    }

    return { drafts: (data as ModuleRow[]).map(toDraft), source: "database" };
  },
);

export async function getModuleDrafts() {
  return (await loadModules()).drafts;
}

export async function getModuleDraft(moduleId: string) {
  return (await getModuleDrafts()).find((draft) => draft.id === moduleId);
}

/** Published modules only, in the shape the learner-facing pages consume. */
export async function getCourseModules(): Promise<CourseModule[]> {
  const drafts = await getModuleDrafts();
  return drafts.filter((draft) => draft.published).map(draftToCourseModule);
}

export async function getCourseSummary() {
  const modules = await getCourseModules();
  return {
    modules,
    totalLessons: modules.reduce((total, module) => total + module.lessons.length, 0),
    totalMinutes: modules.reduce((total, module) => total + module.minutes, 0),
  };
}

export async function getCourseLesson(moduleId: string, lessonId: string) {
  const modules = await getCourseModules();
  const courseModule = modules.find((item) => item.id === moduleId);
  const lesson = courseModule?.lessons.find((item) => item.id === lessonId);
  const flat = modules.flatMap((item) =>
    item.lessons.map((entry) => ({ module: item, lesson: entry })),
  );
  const index = flat.findIndex(
    (item) => item.module.id === moduleId && item.lesson.id === lessonId,
  );

  return {
    modules,
    module: courseModule,
    lesson,
    nextLesson: index >= 0 ? flat[index + 1] : undefined,
  };
}

/** The first lesson a learner should land on, used for "browse modules" links. */
export function getFirstLessonHref(modules: CourseModule[]) {
  const first = modules[0];
  return first?.lessons[0]
    ? `/course/${first.id}/${first.lessons[0].id}`
    : "/dashboard";
}

function fallbackDrafts(): ModuleDraft[] {
  return fallbackModules.map((module) => {
    const [information, check] = module.lessons;
    const draft = emptyModuleDraft(module.number);

    return {
      ...draft,
      id: module.id,
      number: module.number,
      category: module.category,
      title: module.title,
      summary: module.summary,
      minutes: module.minutes,
      accent: module.accent,
      published: true,
      information: {
        id: information.id,
        title: information.title,
        eyebrow: information.eyebrow,
        minutes: information.minutes,
        intro: information.intro,
        sections: information.sections.map((section) => ({
          heading: section.heading,
          body: section.body,
          bullets: section.bullets ?? [],
          note: section.note ?? "",
        })),
      },
      knowledgeCheck: {
        id: check?.id ?? "check",
        title: check?.title ?? "Knowledge check",
        eyebrow: check?.eyebrow ?? "1 question",
        minutes: check?.minutes ?? 5,
        intro: check?.intro ?? "",
        scenario: check?.sections[0]?.body ?? "",
        prompt: check?.knowledgeCheck?.prompt ?? "",
        options: check?.knowledgeCheck?.options ?? [],
        correctIndex: check?.knowledgeCheck?.correctIndex ?? 0,
        explanation: check?.knowledgeCheck?.explanation ?? "",
      },
    };
  });
}
