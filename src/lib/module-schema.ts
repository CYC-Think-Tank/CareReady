import type { CourseModule } from "@/content/course";

export type ModuleAccent = CourseModule["accent"];

export const moduleAccents: ModuleAccent[] = ["mint", "citrus", "coral", "blue"];

/** One block of the module's information section. */
export type InformationSectionDraft = {
  heading: string;
  body: string;
  bullets: string[];
  note: string;
};

/** The editable "information" half of a module. */
export type InformationDraft = {
  id: string;
  title: string;
  eyebrow: string;
  minutes: number;
  intro: string;
  sections: InformationSectionDraft[];
};

/** The editable "knowledge check" half of a module. */
export type KnowledgeCheckDraft = {
  id: string;
  title: string;
  eyebrow: string;
  minutes: number;
  intro: string;
  scenario: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type ModuleDraft = {
  id: string;
  number: number;
  category: string;
  title: string;
  summary: string;
  minutes: number;
  accent: ModuleAccent;
  published: boolean;
  information: InformationDraft;
  knowledgeCheck: KnowledgeCheckDraft;
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Result of the saveModule action. It lives here rather than beside the action
 * because a "use server" file may only export async functions.
 */
export type SaveState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: string[];
};

export const initialSaveState: SaveState = {
  status: "idle",
  message: "",
  errors: [],
};

export function emptyModuleDraft(nextNumber: number): ModuleDraft {
  return {
    id: "",
    number: nextNumber,
    category: "",
    title: "",
    summary: "",
    minutes: 15,
    accent: "mint",
    published: true,
    information: {
      id: "learn",
      title: "",
      eyebrow: "",
      minutes: 10,
      intro: "",
      sections: [emptySection()],
    },
    knowledgeCheck: {
      id: "check",
      title: "Knowledge check",
      eyebrow: "1 question",
      minutes: 5,
      intro: "",
      scenario: "",
      prompt: "",
      options: ["", ""],
      correctIndex: 0,
      explanation: "",
    },
  };
}

export function emptySection(): InformationSectionDraft {
  return { heading: "", body: "", bullets: [], note: "" };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function integer(value: unknown, fallback: number): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed)
    ? Math.trunc(parsed)
    : fallback;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

export function accentOf(value: unknown): ModuleAccent {
  return moduleAccents.includes(value as ModuleAccent)
    ? (value as ModuleAccent)
    : "mint";
}

export function informationOf(value: unknown): InformationDraft {
  const raw = (value ?? {}) as Record<string, unknown>;
  const sections = Array.isArray(raw.sections) ? raw.sections : [];

  return {
    id: text(raw.id, "learn") || "learn",
    title: text(raw.title),
    eyebrow: text(raw.eyebrow),
    minutes: integer(raw.minutes, 10),
    intro: text(raw.intro),
    sections: sections.map((section) => {
      const item = (section ?? {}) as Record<string, unknown>;
      return {
        heading: text(item.heading),
        body: text(item.body),
        bullets: stringList(item.bullets),
        note: text(item.note),
      };
    }),
  };
}

export function knowledgeCheckOf(value: unknown): KnowledgeCheckDraft {
  const raw = (value ?? {}) as Record<string, unknown>;
  const options = stringList(raw.options);

  return {
    id: text(raw.id, "check") || "check",
    title: text(raw.title, "Knowledge check"),
    eyebrow: text(raw.eyebrow, "1 question"),
    minutes: integer(raw.minutes, 5),
    intro: text(raw.intro),
    scenario: text(raw.scenario),
    prompt: text(raw.prompt),
    options,
    correctIndex: Math.min(
      Math.max(integer(raw.correctIndex, 0), 0),
      Math.max(options.length - 1, 0),
    ),
    explanation: text(raw.explanation),
  };
}

export function draftOf(value: unknown): ModuleDraft {
  const raw = (value ?? {}) as Record<string, unknown>;

  return {
    id: slugify(text(raw.id)),
    number: integer(raw.number, 1),
    category: text(raw.category).trim(),
    title: text(raw.title).trim(),
    summary: text(raw.summary).trim(),
    minutes: integer(raw.minutes, 0),
    accent: accentOf(raw.accent),
    published: raw.published !== false,
    information: informationOf(raw.information),
    knowledgeCheck: knowledgeCheckOf(raw.knowledgeCheck),
  };
}

/**
 * Shared by the editor (for inline feedback) and the server action (as the
 * authoritative check). Returns a human readable message per invalid field.
 */
export function validateDraft(draft: ModuleDraft): string[] {
  const errors: string[] = [];

  if (!draft.id) {
    errors.push("Module URL slug is required.");
  } else if (!SLUG_PATTERN.test(draft.id)) {
    errors.push("Module URL slug may only use lowercase letters, numbers, and hyphens.");
  }

  if (!draft.title) errors.push("Module title is required.");
  if (!draft.summary) errors.push("Module summary is required.");
  if (draft.number < 1) errors.push("Module number must be 1 or higher.");
  if (draft.minutes < 0) errors.push("Module minutes cannot be negative.");

  const information = draft.information;
  if (!SLUG_PATTERN.test(information.id)) {
    errors.push("Information lesson slug may only use lowercase letters, numbers, and hyphens.");
  }
  if (!information.title.trim()) errors.push("Information section title is required.");
  if (!information.intro.trim()) errors.push("Information section introduction is required.");
  if (information.sections.length === 0) {
    errors.push("Add at least one information block.");
  }
  information.sections.forEach((section, index) => {
    if (!section.heading.trim()) errors.push(`Information block ${index + 1} needs a heading.`);
    if (!section.body.trim()) errors.push(`Information block ${index + 1} needs body text.`);
  });

  const check = draft.knowledgeCheck;
  if (check.id === information.id) {
    errors.push("The knowledge check slug must differ from the information lesson slug.");
  }
  if (!SLUG_PATTERN.test(check.id)) {
    errors.push("Knowledge check slug may only use lowercase letters, numbers, and hyphens.");
  }
  if (!check.title.trim()) errors.push("Knowledge check title is required.");
  if (!check.prompt.trim()) errors.push("Knowledge check question is required.");

  const answers = check.options.map((option) => option.trim()).filter(Boolean);
  if (answers.length < 2) errors.push("Add at least two answer options.");
  if (answers.length !== check.options.length) errors.push("Answer options cannot be blank.");
  if (check.correctIndex < 0 || check.correctIndex >= check.options.length) {
    errors.push("Choose which answer is correct.");
  }
  if (!check.explanation.trim()) errors.push("Knowledge check explanation is required.");

  return errors;
}

/** Trims text and drops empty bullets before the draft is persisted. */
export function normalizeDraft(draft: ModuleDraft): ModuleDraft {
  return {
    ...draft,
    id: slugify(draft.id),
    category: draft.category.trim(),
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    information: {
      ...draft.information,
      id: slugify(draft.information.id),
      title: draft.information.title.trim(),
      eyebrow: draft.information.eyebrow.trim(),
      intro: draft.information.intro.trim(),
      sections: draft.information.sections.map((section) => ({
        heading: section.heading.trim(),
        body: section.body.trim(),
        bullets: section.bullets.map((bullet) => bullet.trim()).filter(Boolean),
        note: section.note.trim(),
      })),
    },
    knowledgeCheck: {
      ...draft.knowledgeCheck,
      id: slugify(draft.knowledgeCheck.id),
      title: draft.knowledgeCheck.title.trim(),
      eyebrow: draft.knowledgeCheck.eyebrow.trim(),
      intro: draft.knowledgeCheck.intro.trim(),
      scenario: draft.knowledgeCheck.scenario.trim(),
      prompt: draft.knowledgeCheck.prompt.trim(),
      options: draft.knowledgeCheck.options.map((option) => option.trim()),
      explanation: draft.knowledgeCheck.explanation.trim(),
    },
  };
}
