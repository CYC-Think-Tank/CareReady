import {
  ArrowRight,
  BellRing,
  BookOpenCheck,
  Check,
  ChevronRight,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCourseSummary, getFirstLessonHref } from "@/lib/modules";
import { getProgress } from "@/lib/progress";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = {
  title: "My learning",
};

export default async function DashboardPage() {
  const viewer = await getViewer();

  if (isSupabaseConfigured() && !viewer.id) {
    redirect("/sign-in?next=/dashboard");
  }

  const { modules: courseModules, totalLessons } = await getCourseSummary();
  const progress = await getProgress(viewer.id);
  const completedKeys = new Set(
    progress
      .filter((item) => item.completed)
      .map((item) => `${item.module_id}:${item.lesson_id}`),
  );
  const completedCount = completedKeys.size;
  const percent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const flatLessons = courseModules.flatMap((module) =>
    module.lessons.map((lesson) => ({ module, lesson })),
  );
  const nextLesson =
    flatLessons.find(
      ({ module, lesson }) =>
        !completedKeys.has(`${module.id}:${lesson.id}`),
    ) ?? flatLessons[0];
  const browseHref = getFirstLessonHref(courseModules);

  return (
    <div className="mx-auto max-w-[1260px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-14">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Learner dashboard</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-ink sm:text-5xl">
            Welcome back, {viewer.fullName.split(" ")[0]}.
          </h1>
          <p className="mt-3 text-base text-ink/58">
            Continue where you left off or review a workplace protocol.
          </p>
        </div>
        <Link className="button-primary" href={browseHref}>
          View all modules <ArrowRight size={18} />
        </Link>
      </section>

      {viewer.isDemo && (
        <div className="mt-7 flex flex-col gap-4 border-l-4 border-blue bg-blue/10 p-4 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-ink">Preview mode:</strong> this sample
            activity demonstrates the dashboard. Connect Supabase to enable
            private learner accounts and saved progress.
          </p>
          <Link className="shrink-0 font-extrabold text-blue underline" href="/sign-up">
            Create an account
          </Link>
        </div>
      )}

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        {nextLesson ? (
          <article className="border-2 border-ink bg-paper p-6 shadow-[7px_7px_0_0_var(--ink)] sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 bg-coral px-3 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-white">
                  <BookOpenCheck size={16} /> Up next
                </span>
                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-teal">
                  Module {String(nextLesson.module.number).padStart(2, "0")} ·{" "}
                  {nextLesson.lesson.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-ink">
                  {nextLesson.module.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">
                  {nextLesson.module.summary}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-sm font-bold text-ink/50">
                <Clock3 size={17} /> {nextLesson.lesson.minutes} min
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-ink/45">Next lesson</p>
                <p className="mt-1 font-extrabold text-ink">{nextLesson.lesson.title}</p>
              </div>
              <Link
                className="button-secondary"
                href={`/course/${nextLesson.module.id}/${nextLesson.lesson.id}`}
              >
                Continue learning <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        ) : (
          <article className="border-2 border-dashed border-ink/30 bg-paper p-6 sm:p-8">
            <span className="inline-flex items-center gap-2 bg-ink px-3 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-white">
              <BookOpenCheck size={16} /> No modules yet
            </span>
            <h2 className="mt-6 text-3xl font-black tracking-[-0.045em] text-ink">
              Nothing published
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">
              {viewer.isAdmin
                ? "Add your first module from the admin area to get learners started."
                : "Course content is being prepared. Check back soon."}
            </p>
            {viewer.isAdmin && (
              <Link className="button-secondary mt-7" href="/admin/modules/new">
                Create a module <ArrowRight size={18} />
              </Link>
            )}
          </article>
        )}

        <article className="flex flex-col border-2 border-ink bg-ink p-6 text-white sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-mint">
                Overall progress
              </p>
              <p className="mt-3 text-5xl font-black tracking-[-0.06em] text-citrus">
                {percent}<span className="text-2xl">%</span>
              </p>
            </div>
            <span className="grid size-11 place-items-center border border-white/15 bg-white/10 text-mint">
              <BookOpenCheck size={22} />
            </span>
          </div>
          <div
            className="mt-8 h-2 bg-white/15"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress"
          >
            <div className="h-full bg-citrus" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-white/55">
            <span>{completedCount} complete</span>
            <span>{totalLessons - completedCount} remaining</span>
          </div>
          <div className="mt-auto border-t border-white/10 pt-8">
            <p className="flex items-center gap-2 text-sm font-bold text-white/75">
              <ShieldCheck size={18} className="text-citrus" /> Progress is private
            </p>
            <p className="mt-2 text-xs leading-5 text-white/45">
              Only your learner account can access your activity records.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Course pathway</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-ink">
              Physical health essentials
            </h2>
          </div>
          <span className="hidden text-sm font-bold text-ink/45 sm:block">
            {courseModules.length} modules · {totalLessons} lessons
          </span>
        </div>
        <div className="mt-6 border-y border-ink/15 bg-paper">
          {courseModules.map((module) => {
            const completedInModule = module.lessons.filter((lesson) =>
              completedKeys.has(`${module.id}:${lesson.id}`),
            ).length;
            const moduleComplete = completedInModule === module.lessons.length;

            return (
              <Link
                key={module.id}
                href={`/course/${module.id}/${module.lessons[0].id}`}
                className="group grid gap-4 border-x border-b border-ink/15 p-5 transition hover:bg-mint/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal sm:grid-cols-[3rem_1fr_9rem_1.5rem] sm:items-center sm:gap-6"
              >
                <span
                  className={`grid size-10 place-items-center text-sm font-black ${
                    moduleComplete ? "bg-teal text-white" : "bg-cream text-ink/45"
                  }`}
                >
                  {moduleComplete ? <Check size={18} /> : String(module.number).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-teal">
                    {module.category}
                  </span>
                  <span className="mt-1 block font-extrabold text-ink">{module.title}</span>
                </span>
                <span className="text-xs font-bold text-ink/45">
                  {completedInModule} of {module.lessons.length} complete
                </span>
                <ChevronRight
                  size={19}
                  className="hidden text-ink/35 transition group-hover:translate-x-1 group-hover:text-teal sm:block"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <Link
          href="/protocols"
          className="group flex items-start gap-5 border border-ink/15 bg-citrus/30 p-6 transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <span className="grid size-11 shrink-0 place-items-center bg-ink text-citrus">
            <BellRing size={21} />
          </span>
          <span>
            <span className="font-extrabold text-ink">Review your protocols</span>
            <span className="mt-2 block text-sm leading-6 text-ink/60">
              Three workplace checks are ready for acknowledgement.
            </span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-teal">
              Open reminders <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
        <Link
          href="/funding"
          className="group flex items-start gap-5 border border-ink/15 bg-blue/10 p-6 transition hover:border-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          <span className="grid size-11 shrink-0 place-items-center bg-blue text-white">
            <ShieldCheck size={21} />
          </span>
          <span>
            <span className="font-extrabold text-ink">Ontario funding information</span>
            <span className="mt-2 block text-sm leading-6 text-ink/60">
              Review the placeholder employer and training-support information.
            </span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-blue">
              View funding page <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
      </section>
    </div>
  );
}
