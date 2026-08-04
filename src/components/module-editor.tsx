"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  CircleAlert,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { saveModule } from "@/app/(platform)/admin/actions";
import {
  emptySection,
  initialSaveState,
  moduleAccents,
  slugify,
  validateDraft,
  type InformationSectionDraft,
  type ModuleDraft,
} from "@/lib/module-schema";

const accentSwatch: Record<(typeof moduleAccents)[number], string> = {
  mint: "bg-mint",
  citrus: "bg-citrus",
  coral: "bg-coral",
  blue: "bg-blue",
};

export function ModuleEditor({
  initialDraft,
  isNew,
}: {
  initialDraft: ModuleDraft;
  isNew: boolean;
}) {
  const [draft, setDraft] = useState<ModuleDraft>(initialDraft);
  const [state, formAction, pending] = useActionState(saveModule, initialSaveState);
  const clientErrors = useMemo(() => validateDraft(draft), [draft]);
  const errors = state.errors.length > 0 ? state.errors : [];

  function patch(changes: Partial<ModuleDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  function patchInformation(changes: Partial<ModuleDraft["information"]>) {
    setDraft((current) => ({
      ...current,
      information: { ...current.information, ...changes },
    }));
  }

  function patchCheck(changes: Partial<ModuleDraft["knowledgeCheck"]>) {
    setDraft((current) => ({
      ...current,
      knowledgeCheck: { ...current.knowledgeCheck, ...changes },
    }));
  }

  function updateSections(
    update: (sections: InformationSectionDraft[]) => InformationSectionDraft[],
  ) {
    setDraft((current) => ({
      ...current,
      information: {
        ...current.information,
        sections: update(current.information.sections),
      },
    }));
  }

  function patchSection(index: number, changes: Partial<InformationSectionDraft>) {
    updateSections((sections) =>
      sections.map((section, position) =>
        position === index ? { ...section, ...changes } : section,
      ),
    );
  }

  function moveSection(index: number, direction: -1 | 1) {
    updateSections((sections) => {
      const target = index + direction;
      if (target < 0 || target >= sections.length) return sections;
      const next = [...sections];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateOptions(update: (options: string[]) => string[]) {
    setDraft((current) => {
      const options = update(current.knowledgeCheck.options);
      return {
        ...current,
        knowledgeCheck: {
          ...current.knowledgeCheck,
          options,
          correctIndex: Math.min(
            current.knowledgeCheck.correctIndex,
            Math.max(options.length - 1, 0),
          ),
        },
      };
    });
  }

  return (
    <form action={formAction} className="grid gap-7">
      <input type="hidden" name="payload" value={JSON.stringify(draft)} />
      <input type="hidden" name="originalId" value={isNew ? "" : initialDraft.id} />

      {state.status !== "idle" && (
        <div
          role="status"
          className={`flex items-start gap-3 border-l-4 p-4 text-sm leading-6 ${
            state.status === "success"
              ? "border-teal bg-mint/30 text-ink"
              : "border-coral bg-coral/10 text-ink"
          }`}
        >
          {state.status === "success" ? (
            <Check size={19} className="mt-0.5 shrink-0 text-teal" />
          ) : (
            <CircleAlert size={19} className="mt-0.5 shrink-0 text-coral" />
          )}
          <div>
            <p className="font-extrabold">{state.message}</p>
            {errors.length > 0 && (
              <ul className="mt-2 list-disc pl-5">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ---------- Module basics ---------- */}
      <section className="admin-card" aria-labelledby="module-basics">
        <h2 id="module-basics" className="text-2xl font-black tracking-[-0.035em] text-ink">
          Module details
        </h2>
        <p className="mt-2 text-sm text-ink/55">
          How the module appears in the course pathway and on the dashboard.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="module-title" className="field-label">
              Title
            </label>
            <input
              id="module-title"
              className="text-field"
              value={draft.title}
              onChange={(event) => {
                const title = event.target.value;
                patch(isNew ? { title, id: slugify(title) } : { title });
              }}
              placeholder="Notice changes early"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="module-slug" className="field-label">
              URL slug
            </label>
            <input
              id="module-slug"
              className="text-field disabled:bg-cream disabled:text-ink/55"
              value={draft.id}
              disabled={!isNew}
              onChange={(event) => patch({ id: event.target.value })}
              placeholder="notice-changes-early"
              aria-describedby="module-slug-help"
            />
            <p id="module-slug-help" className="mt-2 text-xs text-ink/50">
              {isNew
                ? `Lessons will live at /course/${draft.id || "your-slug"}/…`
                : "The slug is fixed once the module exists, because learner progress is stored against it."}
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="module-summary" className="field-label">
              Summary
            </label>
            <textarea
              id="module-summary"
              className="textarea-field"
              value={draft.summary}
              onChange={(event) => patch({ summary: event.target.value })}
              placeholder="One or two sentences shown on the dashboard card."
            />
          </div>

          <div>
            <label htmlFor="module-category" className="field-label">
              Category
            </label>
            <input
              id="module-category"
              className="text-field"
              value={draft.category}
              onChange={(event) => patch({ category: event.target.value })}
              placeholder="Skin health"
            />
          </div>

          <div>
            <label htmlFor="module-number" className="field-label">
              Order number
            </label>
            <input
              id="module-number"
              type="number"
              min={1}
              className="text-field"
              value={draft.number}
              onChange={(event) => patch({ number: Number(event.target.value) })}
            />
          </div>

          <div>
            <label htmlFor="module-minutes" className="field-label">
              Total minutes
            </label>
            <input
              id="module-minutes"
              type="number"
              min={0}
              className="text-field"
              value={draft.minutes}
              onChange={(event) => patch({ minutes: Number(event.target.value) })}
            />
          </div>

          <div>
            <span className="field-label">Accent colour</span>
            <div className="flex flex-wrap gap-2">
              {moduleAccents.map((accent) => (
                <button
                  key={accent}
                  type="button"
                  aria-pressed={draft.accent === accent}
                  onClick={() => patch({ accent })}
                  className={`inline-flex min-h-12 items-center gap-2 border-2 px-3 text-sm font-bold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                    draft.accent === accent
                      ? "border-ink bg-white text-ink"
                      : "border-ink/15 text-ink/55 hover:border-ink/40"
                  }`}
                >
                  <span className={`size-4 ${accentSwatch[accent]}`} aria-hidden="true" />
                  {accent}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 border border-ink/15 bg-cream p-4 sm:col-span-2">
            <input
              type="checkbox"
              className="mt-1 size-5 accent-[var(--teal)]"
              checked={draft.published}
              onChange={(event) => patch({ published: event.target.checked })}
            />
            <span>
              <span className="block font-extrabold text-ink">Published</span>
              <span className="mt-1 block text-sm text-ink/55">
                Unpublished modules stay visible to admins only and are hidden from
                learners.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* ---------- Information section ---------- */}
      <section className="admin-card" aria-labelledby="information-section">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-mint px-3 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-ink">
            Part 1
          </span>
          <h2
            id="information-section"
            className="text-2xl font-black tracking-[-0.035em] text-ink"
          >
            Information
          </h2>
        </div>
        <p className="mt-2 text-sm text-ink/55">
          The teaching lesson learners read before the knowledge check.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="information-title" className="field-label">
              Lesson title
            </label>
            <input
              id="information-title"
              className="text-field"
              value={draft.information.title}
              onChange={(event) => {
                const title = event.target.value;
                patchInformation(
                  isNew ? { title, id: slugify(title) || "learn" } : { title },
                );
              }}
              placeholder="Look, listen, compare"
            />
          </div>

          <div>
            <label htmlFor="information-eyebrow" className="field-label">
              Eyebrow label
            </label>
            <input
              id="information-eyebrow"
              className="text-field"
              value={draft.information.eyebrow}
              onChange={(event) => patchInformation({ eyebrow: event.target.value })}
              placeholder="Observation practice"
            />
          </div>

          <div>
            <label htmlFor="information-minutes" className="field-label">
              Minutes
            </label>
            <input
              id="information-minutes"
              type="number"
              min={0}
              className="text-field"
              value={draft.information.minutes}
              onChange={(event) =>
                patchInformation({ minutes: Number(event.target.value) })
              }
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="information-intro" className="field-label">
              Introduction
            </label>
            <textarea
              id="information-intro"
              className="textarea-field"
              value={draft.information.intro}
              onChange={(event) => patchInformation({ intro: event.target.value })}
              placeholder="The opening paragraph shown in large type at the top of the lesson."
            />
          </div>
        </div>

        <div className="mt-8 border-t-2 border-ink/10 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-black text-ink">
              Content blocks ({draft.information.sections.length})
            </h3>
            <button
              type="button"
              className="button-quiet"
              onClick={() => updateSections((sections) => [...sections, emptySection()])}
            >
              <Plus size={17} /> Add block
            </button>
          </div>

          <div className="mt-5 grid gap-5">
            {draft.information.sections.map((section, index) => (
              <fieldset key={index} className="border border-ink/20 bg-cream p-4 sm:p-5">
                <legend className="bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-[0.13em] text-white">
                  Block {String(index + 1).padStart(2, "0")}
                </legend>

                <div className="mb-4 flex justify-end gap-1">
                  <IconButton
                    label={`Move block ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                  >
                    <ArrowUp size={16} />
                  </IconButton>
                  <IconButton
                    label={`Move block ${index + 1} down`}
                    disabled={index === draft.information.sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                  >
                    <ArrowDown size={16} />
                  </IconButton>
                  <IconButton
                    label={`Remove block ${index + 1}`}
                    destructive
                    disabled={draft.information.sections.length === 1}
                    onClick={() =>
                      updateSections((sections) =>
                        sections.filter((_, position) => position !== index),
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label htmlFor={`section-heading-${index}`} className="field-label">
                      Heading
                    </label>
                    <input
                      id={`section-heading-${index}`}
                      className="text-field"
                      value={section.heading}
                      onChange={(event) =>
                        patchSection(index, { heading: event.target.value })
                      }
                      placeholder="Use the same routine each time"
                    />
                  </div>

                  <div>
                    <label htmlFor={`section-body-${index}`} className="field-label">
                      Body
                    </label>
                    <textarea
                      id={`section-body-${index}`}
                      className="textarea-field"
                      value={section.body}
                      onChange={(event) =>
                        patchSection(index, { body: event.target.value })
                      }
                    />
                  </div>

                  <BulletEditor
                    bullets={section.bullets}
                    sectionIndex={index}
                    onChange={(bullets) => patchSection(index, { bullets })}
                  />

                  <div>
                    <label htmlFor={`section-note-${index}`} className="field-label">
                      Callout note <span className="font-normal text-ink/45">(optional)</span>
                    </label>
                    <textarea
                      id={`section-note-${index}`}
                      className="textarea-field min-h-20"
                      value={section.note}
                      onChange={(event) =>
                        patchSection(index, { note: event.target.value })
                      }
                      placeholder="Shown in a highlighted box beneath the block."
                    />
                  </div>
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Knowledge check ---------- */}
      <section className="admin-card" aria-labelledby="knowledge-check-section">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-citrus px-3 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-ink">
            Part 2
          </span>
          <h2
            id="knowledge-check-section"
            className="text-2xl font-black tracking-[-0.035em] text-ink"
          >
            Knowledge check
          </h2>
        </div>
        <p className="mt-2 text-sm text-ink/55">
          A single multiple-choice question learners answer to complete the module.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="check-title" className="field-label">
              Lesson title
            </label>
            <input
              id="check-title"
              className="text-field"
              value={draft.knowledgeCheck.title}
              onChange={(event) => patchCheck({ title: event.target.value })}
            />
          </div>

          <div>
            <label htmlFor="check-eyebrow" className="field-label">
              Eyebrow label
            </label>
            <input
              id="check-eyebrow"
              className="text-field"
              value={draft.knowledgeCheck.eyebrow}
              onChange={(event) => patchCheck({ eyebrow: event.target.value })}
            />
          </div>

          <div>
            <label htmlFor="check-minutes" className="field-label">
              Minutes
            </label>
            <input
              id="check-minutes"
              type="number"
              min={0}
              className="text-field"
              value={draft.knowledgeCheck.minutes}
              onChange={(event) => patchCheck({ minutes: Number(event.target.value) })}
            />
          </div>

          <div>
            <label htmlFor="check-slug" className="field-label">
              URL slug
            </label>
            <input
              id="check-slug"
              className="text-field disabled:bg-cream disabled:text-ink/55"
              value={draft.knowledgeCheck.id}
              disabled={!isNew}
              onChange={(event) => patchCheck({ id: event.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="check-intro" className="field-label">
              Introduction
            </label>
            <textarea
              id="check-intro"
              className="textarea-field min-h-20"
              value={draft.knowledgeCheck.intro}
              onChange={(event) => patchCheck({ intro: event.target.value })}
              placeholder="Apply what you just read to a short workplace scenario."
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="check-scenario" className="field-label">
              Scenario <span className="font-normal text-ink/45">(optional)</span>
            </label>
            <textarea
              id="check-scenario"
              className="textarea-field"
              value={draft.knowledgeCheck.scenario}
              onChange={(event) => patchCheck({ scenario: event.target.value })}
              placeholder="The situation shown above the question."
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="check-prompt" className="field-label">
              Question
            </label>
            <textarea
              id="check-prompt"
              className="textarea-field min-h-20"
              value={draft.knowledgeCheck.prompt}
              onChange={(event) => patchCheck({ prompt: event.target.value })}
              placeholder="What is the best next step?"
            />
          </div>
        </div>

        <div className="mt-8 border-t-2 border-ink/10 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-ink">Answer options</h3>
              <p className="mt-1 text-sm text-ink/55">
                Select the radio button beside the correct answer.
              </p>
            </div>
            <button
              type="button"
              className="button-quiet"
              onClick={() => updateOptions((options) => [...options, ""])}
            >
              <Plus size={17} /> Add option
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {draft.knowledgeCheck.options.map((option, index) => {
              const isCorrect = draft.knowledgeCheck.correctIndex === index;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 border-2 p-3 ${
                    isCorrect ? "border-teal bg-mint/25" : "border-ink/15 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="correct-answer"
                    className="size-5 shrink-0 accent-[var(--teal)]"
                    checked={isCorrect}
                    onChange={() => patchCheck({ correctIndex: index })}
                    aria-label={`Mark option ${String.fromCharCode(65 + index)} as correct`}
                  />
                  <span className="grid size-8 shrink-0 place-items-center border border-ink/25 text-xs font-black text-ink/60">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    className="min-h-11 w-full border-0 bg-transparent px-1 text-base text-ink outline-none placeholder:text-ink/35"
                    value={option}
                    onChange={(event) =>
                      updateOptions((options) =>
                        options.map((item, position) =>
                          position === index ? event.target.value : item,
                        ),
                      )
                    }
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    aria-label={`Answer option ${String.fromCharCode(65 + index)}`}
                  />
                  <IconButton
                    label={`Remove option ${String.fromCharCode(65 + index)}`}
                    destructive
                    disabled={draft.knowledgeCheck.options.length <= 2}
                    onClick={() =>
                      updateOptions((options) =>
                        options.filter((_, position) => position !== index),
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <label htmlFor="check-explanation" className="field-label">
              Explanation
            </label>
            <textarea
              id="check-explanation"
              className="textarea-field"
              value={draft.knowledgeCheck.explanation}
              onChange={(event) => patchCheck({ explanation: event.target.value })}
              placeholder="Shown after the learner answers, explaining why the correct option is best."
            />
          </div>
        </div>
      </section>

      {/* ---------- Save bar ---------- */}
      <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t-2 border-ink bg-cream/95 px-5 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:justify-between sm:px-0 sm:pr-4">
        <p className="text-sm text-ink/55">
          {clientErrors.length > 0
            ? `${clientErrors.length} field${clientErrors.length === 1 ? "" : "s"} still need attention.`
            : "Ready to save."}
        </p>
        <div className="flex gap-3">
          <Link href="/admin" className="button-quiet">
            Cancel
          </Link>
          <button type="submit" className="button-primary" disabled={pending}>
            {pending ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isNew ? "Create module" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function BulletEditor({
  bullets,
  sectionIndex,
  onChange,
}: {
  bullets: string[];
  sectionIndex: number;
  onChange: (bullets: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="field-label mb-0">
          Bullet points <span className="font-normal text-ink/45">(optional)</span>
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-extrabold text-teal underline"
          onClick={() => onChange([...bullets, ""])}
        >
          <Plus size={15} /> Add bullet
        </button>
      </div>
      {bullets.length === 0 ? (
        <p className="border border-dashed border-ink/25 p-3 text-sm text-ink/45">
          No bullet points yet.
        </p>
      ) : (
        <div className="grid gap-2">
          {bullets.map((bullet, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className="text-field min-h-11"
                value={bullet}
                onChange={(event) =>
                  onChange(
                    bullets.map((item, position) =>
                      position === index ? event.target.value : item,
                    ),
                  )
                }
                aria-label={`Block ${sectionIndex + 1}, bullet ${index + 1}`}
              />
              <IconButton
                label={`Remove bullet ${index + 1} from block ${sectionIndex + 1}`}
                destructive
                onClick={() =>
                  onChange(bullets.filter((_, position) => position !== index))
                }
              >
                <Trash2 size={16} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  destructive,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid size-9 shrink-0 place-items-center border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-35 ${
        destructive
          ? "border-coral/40 text-coral hover:enabled:bg-coral/10"
          : "border-ink/20 text-ink/60 hover:enabled:bg-mint/30"
      }`}
    >
      {children}
    </button>
  );
}
