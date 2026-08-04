import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Info,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonExperience } from "@/components/lesson-experience";
import { getCourseLesson } from "@/lib/modules";
import { getProgress } from "@/lib/progress";
import { getViewer } from "@/lib/viewer";

type PageProps = {
  params: Promise<{ moduleId: string; lessonId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId, lessonId } = await params;
  const { module: courseModule, lesson } = await getCourseLesson(moduleId, lessonId);
  return {
    title:
      courseModule && lesson
        ? `${courseModule.title}: ${lesson.title}`
        : "Course lesson",
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { moduleId, lessonId } = await params;
  const { module: courseModule, lesson, nextLesson } = await getCourseLesson(
    moduleId,
    lessonId,
  );

  if (!courseModule || !lesson) notFound();

  const viewer = await getViewer();
  const progress = await getProgress(viewer.id);
  const initiallyComplete = progress.some(
    (record) =>
      record.module_id === moduleId &&
      record.lesson_id === lessonId &&
      record.completed,
  );
  const lessonIndex = courseModule.lessons.findIndex(
    (item) => item.id === lesson.id,
  );

  return (
    <div className="pb-28 lg:pb-16">
      <div className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-[1260px] items-center gap-2 overflow-x-auto px-5 py-4 text-xs font-bold text-ink/50 sm:px-8">
          <Link href="/dashboard" className="inline-flex shrink-0 items-center gap-1.5 hover:text-teal">
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <ChevronRight size={14} className="shrink-0 text-ink/25" />
          <span className="shrink-0">Module {courseModule.number}</span>
          <ChevronRight size={14} className="shrink-0 text-ink/25" />
          <span className="truncate text-ink">{lesson.title}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1260px] gap-10 px-5 py-8 sm:px-8 sm:py-10 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <article className="min-w-0">
          <div className="border-l-[6px] border-coral pl-5 sm:pl-7">
            <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] text-teal">
              <span>Module {String(courseModule.number).padStart(2, "0")}</span>
              <span className="size-1 bg-ink/25" aria-hidden="true" />
              <span>{courseModule.category}</span>
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.055em] text-ink sm:text-5xl">
              {lesson.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-5 text-sm font-bold text-ink/50">
              <span className="inline-flex items-center gap-2">
                <Clock3 size={17} /> {lesson.minutes} minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen size={17} /> Lesson {lessonIndex + 1} of{" "}
                {courseModule.lessons.length}
              </span>
            </div>
          </div>

          <div className="mt-8 border border-blue/30 bg-blue/10 p-4 text-sm leading-6 text-ink/70 sm:flex sm:gap-3">
            <ShieldAlert size={20} className="mb-2 shrink-0 text-blue sm:mb-0 sm:mt-0.5" />
            <p>
              <strong className="text-ink">Training prototype:</strong> this
              material is placeholder information and must be clinically reviewed.
              Always follow the current plan of care and your organization’s approved protocols.
            </p>
          </div>

          <p className="mt-9 text-xl font-semibold leading-8 text-ink/75">{lesson.intro}</p>

          <div className="mt-10 space-y-10">
            {lesson.sections.map((section, index) => (
              <section key={section.heading} aria-labelledby={`section-${index}`}>
                <div className="flex items-start gap-4">
                  <span className="mt-1 grid size-8 shrink-0 place-items-center bg-mint text-xs font-black text-ink">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2
                      id={`section-${index}`}
                      className="text-2xl font-black tracking-[-0.035em] text-ink"
                    >
                      {section.heading}
                    </h2>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-ink/70">
                      {section.body}
                    </p>
                    {section.bullets && (
                      <ul className="mt-6 grid gap-3" role="list">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-3 border-l-2 border-mint bg-paper px-4 py-3 text-sm leading-6 text-ink/70"
                          >
                            <Check size={17} className="mt-0.5 shrink-0 text-teal" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.note && (
                      <div className="mt-6 flex gap-3 border border-coral/35 bg-coral/10 p-4 text-sm leading-6 text-ink/70">
                        <Info size={18} className="mt-0.5 shrink-0 text-coral" />
                        <p>{section.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <LessonExperience
            module={courseModule}
            lesson={lesson}
            nextLesson={nextLesson}
            viewerId={viewer.id}
            initiallyComplete={initiallyComplete}
          />
        </article>

        <aside className="hidden xl:block" aria-label="Module lessons">
          <div className="sticky top-24 border border-ink/15 bg-paper p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal">
              In this module
            </p>
            <h2 className="mt-2 text-lg font-black text-ink">
              {courseModule.title}
            </h2>
            <div className="mt-5 h-1.5 bg-ink/10">
              <div
                className="h-full bg-teal"
                style={{
                  width: `${((lessonIndex + 1) / courseModule.lessons.length) * 100}%`,
                }}
              />
            </div>
            <nav className="mt-5 grid gap-2">
              {courseModule.lessons.map((item, index) => {
                const active = item.id === lesson.id;
                return (
                  <Link
                    key={item.id}
                    href={`/course/${courseModule.id}/${item.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-start gap-3 border-l-2 px-3 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                      active
                        ? "border-teal bg-mint/25 font-extrabold text-ink"
                        : "border-transparent font-semibold text-ink/55 hover:border-ink/25 hover:text-ink"
                    }`}
                  >
                    <span className="font-mono text-xs text-ink/35">0{index + 1}</span>
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/dashboard"
              className="mt-6 flex items-center gap-2 border-t border-ink/10 pt-5 text-sm font-extrabold text-teal"
            >
              <ArrowLeft size={16} /> Back to course
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
