"use client";

import { ArrowRight, Check, CircleAlert, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { CourseModule, Lesson } from "@/content/course";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

type NextLesson = { module: CourseModule; lesson: Lesson } | undefined;

export function LessonExperience({
  module,
  lesson,
  nextLesson,
  viewerId,
  initiallyComplete,
}: {
  module: CourseModule;
  lesson: Lesson;
  nextLesson: NextLesson;
  viewerId: string | null;
  initiallyComplete: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [complete, setComplete] = useState(initiallyComplete);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const check = lesson.knowledgeCheck;
  const answerIsCorrect = selected === check?.correctIndex;

  function submitAnswer() {
    if (selected === null) {
      setMessage("Choose an answer before checking your response.");
      return;
    }
    setSubmitted(true);
    setMessage(null);
  }

  async function markComplete() {
    if (check && !submitted) {
      setMessage("Check your answer before completing this lesson.");
      return;
    }

    setSaving(true);
    setMessage(null);

    if (!viewerId && isSupabaseConfigured()) {
      setSaving(false);
      router.push(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!viewerId || !isSupabaseConfigured()) {
      setComplete(true);
      setSaving(false);
      setMessage(
        "Preview complete. Connect Supabase to save progress to a learner account.",
      );
      return;
    }

    const supabase = createClient();
    const score = check ? (answerIsCorrect ? 100 : 0) : null;
    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: viewerId,
        module_id: module.id,
        lesson_id: lesson.id,
        completed: true,
        score,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_id,lesson_id" },
    );

    if (!error && check) {
      await supabase.from("quiz_attempts").insert({
        user_id: viewerId,
        module_id: module.id,
        lesson_id: lesson.id,
        score,
        answers: { selected, correct: check.correctIndex },
      });
    }

    if (error) {
      setMessage("Progress could not be saved. Please try again.");
    } else {
      setComplete(true);
      setMessage("Lesson complete. Your progress has been saved.");
    }
    setSaving(false);
  }

  return (
    <>
      {check && (
        <section className="mt-10 border-2 border-ink bg-cream p-5 sm:p-7" aria-labelledby="knowledge-check">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center bg-citrus font-black text-ink">?</span>
            <div>
              <p className="eyebrow">Knowledge check</p>
              <h2 id="knowledge-check" className="mt-1 text-xl font-black text-ink">
                {check.prompt}
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3" role="radiogroup" aria-label={check.prompt}>
            {check.options.map((option, index) => {
              const isSelected = selected === index;
              const answerState =
                submitted && index === check.correctIndex
                  ? "border-teal bg-mint/35"
                  : submitted && isSelected
                    ? "border-coral bg-coral/10"
                    : isSelected
                      ? "border-blue bg-blue/10"
                      : "border-ink/15 bg-white hover:border-ink/35";

              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={submitted}
                  onClick={() => {
                    setSelected(index);
                    setMessage(null);
                  }}
                  className={`flex min-h-14 items-center gap-4 border-2 p-4 text-left text-sm font-semibold text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:cursor-default ${answerState}`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center border text-xs font-black ${
                      isSelected ? "border-ink bg-ink text-white" : "border-ink/25 text-ink/50"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
          {!submitted ? (
            <button type="button" onClick={submitAnswer} className="button-primary mt-6">
              Check answer
            </button>
          ) : (
            <div
              className={`mt-6 border-l-4 p-4 text-sm leading-6 ${
                answerIsCorrect
                  ? "border-teal bg-mint/30 text-ink"
                  : "border-coral bg-coral/10 text-ink"
              }`}
              role="status"
            >
              <p className="font-extrabold">
                {answerIsCorrect ? "That’s right." : "Not quite."}
              </p>
              <p className="mt-1">
                {answerIsCorrect
                  ? check.explanation
                  : `The strongest answer is ${String.fromCharCode(65 + check.correctIndex)}. ${check.explanation}`}
              </p>
              {!answerIsCorrect && (
                <button
                  type="button"
                  className="mt-3 font-extrabold text-teal underline"
                  onClick={() => {
                    setSubmitted(false);
                    setSelected(null);
                  }}
                >
                  Try again
                </button>
              )}
            </div>
          )}
        </section>
      )}

      <section className="mt-10 border-t-2 border-ink pt-7">
        {message && (
          <div
            className="mb-5 flex items-start gap-3 border-l-4 border-blue bg-blue/10 p-4 text-sm leading-6 text-ink/75"
            role="status"
          >
            <CircleAlert size={19} className="mt-0.5 shrink-0 text-blue" />
            <p>{message}</p>
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-ink/55">
            {complete ? (
              <>
                <span className="grid size-8 place-items-center bg-teal text-white">
                  <Check size={17} />
                </span>
                <span className="font-bold text-teal">Lesson completed</span>
              </>
            ) : viewerId ? (
              <>
                <LockKeyhole size={18} /> Progress saves to your account
              </>
            ) : (
              <>
                <LockKeyhole size={18} /> Sign in to save progress
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {!complete && (
              <button
                type="button"
                className="button-primary"
                onClick={markComplete}
                disabled={saving}
              >
                {saving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                Mark complete
              </button>
            )}
            {complete && nextLesson && (
              <Link
                href={`/course/${nextLesson.module.id}/${nextLesson.lesson.id}`}
                className="button-secondary"
              >
                Next lesson <ArrowRight size={18} />
              </Link>
            )}
            {complete && !nextLesson && (
              <Link href="/dashboard" className="button-secondary">
                Back to dashboard <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
