import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";
import { getCourseSummary, getFirstLessonHref } from "@/lib/modules";

const accentStyles = {
  mint: "border-mint bg-mint/35",
  citrus: "border-citrus bg-citrus/30",
  coral: "border-coral bg-coral/10",
  blue: "border-blue bg-blue/10",
};

export default async function Home() {
  const { modules: courseModules, totalLessons, totalMinutes } =
    await getCourseSummary();
  const firstLessonHref = getFirstLessonHref(courseModules);

  return (
    <div className="min-h-screen bg-cream">
      <PublicHeader />
      <main>
        <section className="overflow-hidden border-b border-ink/10">
          <div className="page-shell grid items-center gap-14 py-14 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 border border-teal/25 bg-mint/35 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.13em] text-teal">
                <Sparkles size={15} aria-hidden="true" />
                Ontario workforce training prototype
              </div>
              <h1 className="max-w-3xl text-[clamp(2.65rem,6vw,4.7rem)] font-black leading-[0.98] tracking-[-0.065em] text-ink">
                Notice earlier.
                <span className="block text-teal">Act with confidence.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/67 sm:text-xl">
                Practical physical healthcare training for personal support
                workers and the wider care team—built around observation,
                prevention, and the right next step.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="button-secondary" href="/sign-up">
                  Create a learner account
                  <ArrowRight size={18} />
                </Link>
                <Link
                  className="button-quiet min-h-12 border-2 border-ink/20 bg-transparent"
                  href={firstLessonHref}
                >
                  Preview a lesson
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-ink/60">
                <span className="inline-flex items-center gap-2">
                  <Check size={17} className="text-teal" /> Open to care workers
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check size={17} className="text-teal" /> Learn at your pace
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check size={17} className="text-teal" /> Progress saved
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[510px] lg:mr-0">
              <div
                className="absolute -left-5 top-8 hidden h-40 w-10 bg-coral md:block"
                aria-hidden="true"
              />
              <div
                className="absolute -right-5 bottom-12 hidden size-24 border-[12px] border-citrus md:block"
                aria-hidden="true"
              />
              <div className="relative border-2 border-ink bg-paper p-5 shadow-[12px_12px_0_0_var(--ink)] sm:p-7">
                <div className="flex items-start justify-between gap-6 border-b border-ink/10 pb-5">
                  <div>
                    <p className="eyebrow">Your learning plan</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">
                      Physical health essentials
                    </h2>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center bg-mint text-ink">
                    <BookOpenCheck size={25} aria-hidden="true" />
                  </span>
                </div>
                <div className="py-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-ink/55">Course progress</p>
                      <p className="mt-1 text-4xl font-black tracking-[-0.05em] text-ink">
                        07<span className="text-xl text-ink/35">%</span>
                      </p>
                    </div>
                    <p className="text-right text-xs font-bold leading-5 text-teal">
                      1 of {totalLessons}
                      <br /> lessons complete
                    </p>
                  </div>
                  <div
                    className="mt-4 h-2 bg-ink/10"
                    role="progressbar"
                    aria-label="Example course progress"
                    aria-valuenow={7}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-full w-[7%] bg-teal" />
                  </div>
                </div>
                <div className="border border-ink/15 bg-cream p-4 sm:p-5">
                  <div className="flex gap-4">
                    <span className="grid size-10 shrink-0 place-items-center bg-coral text-white">
                      <span className="text-sm font-black">01</span>
                    </span>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-coral">
                        Continue learning
                      </p>
                      <h3 className="mt-2 font-extrabold text-ink">
                        Notice changes early
                      </h3>
                      <p className="mt-1 text-sm text-ink/55">12 min · Observation practice</p>
                    </div>
                  </div>
                  <Link
                    href={firstLessonHref}
                    className="mt-5 flex min-h-11 w-full items-center justify-between border-t border-ink/15 pt-4 text-sm font-extrabold text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  >
                    Resume lesson <ArrowRight size={18} />
                  </Link>
                </div>
                <div className="mt-5 flex items-center gap-3 bg-ink px-4 py-3 text-white">
                  <BellRing size={18} className="shrink-0 text-citrus" />
                  <p className="text-xs font-semibold leading-5 text-white/75">
                    Reminder: check your current workplace fall protocol.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink text-white" aria-label="Course at a glance">
          <div className="page-shell grid grid-cols-2 gap-px bg-white/15 md:grid-cols-4">
            {[
              [String(courseModules.length), "Focused modules"],
              [String(totalLessons), "Short lessons"],
              [`${Math.ceil(totalMinutes / 60)} hrs`, "Estimated time"],
              ["Any role", "Care-team access"],
            ].map(([value, label]) => (
              <div key={label} className="bg-ink px-5 py-7 md:px-7">
                <p className="text-3xl font-black tracking-[-0.04em] text-citrus">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/55">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="approach" className="page-shell py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="eyebrow">Designed for the next shift</p>
              <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-[-0.055em] text-ink sm:text-5xl">
                Learn a repeatable way to respond.
              </h2>
              <p className="mt-6 text-lg leading-8 text-ink/65">
                Every module turns a broad safety topic into a small set of
                observable actions. The course reinforces role clarity and the
                organization’s current protocol.
              </p>
            </div>
            <div className="grid border-2 border-ink bg-ink sm:grid-cols-2">
              {[
                {
                  icon: UsersRound,
                  number: "01",
                  title: "Notice",
                  copy: "Compare with the person’s usual condition and listen to what they report.",
                  colour: "bg-mint",
                },
                {
                  icon: ClipboardCheck,
                  number: "02",
                  title: "Document",
                  copy: "Record factual, useful details in the approved place and format.",
                  colour: "bg-citrus",
                },
                {
                  icon: BellRing,
                  number: "03",
                  title: "Report",
                  copy: "Use the correct pathway and make the next action clear to the team.",
                  colour: "bg-coral text-white",
                },
                {
                  icon: ShieldCheck,
                  number: "04",
                  title: "Recheck",
                  copy: "Return to the current protocol whenever a task, condition, or instruction changes.",
                  colour: "bg-blue text-white",
                },
              ].map(({ icon: Icon, number, title, copy, colour }) => (
                <article key={title} className="border border-white/10 bg-paper p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className={`grid size-11 place-items-center ${colour}`}>
                      <Icon size={21} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-bold text-ink/35">{number}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-black tracking-[-0.035em] text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/60">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="course" className="border-y border-ink/10 bg-paper py-20 sm:py-24">
          <div className="page-shell">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Course outline</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-ink sm:text-5xl">
                  Seven practical modules.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-ink/60">
                Placeholder topics are ready to be replaced with clinically
                approved Ontario content and organization-specific procedures.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              {courseModules.map((module) => (
                <Link
                  key={module.id}
                  href={`/course/${module.id}/${module.lessons[0].id}`}
                  className={`group grid gap-5 border-l-[6px] border border-ink/15 bg-white p-5 transition hover:-translate-y-1 hover:border-ink/40 hover:shadow-[6px_6px_0_0_var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal sm:grid-cols-[3rem_1fr_auto] sm:items-center ${accentStyles[module.accent]}`}
                >
                  <span className="font-mono text-sm font-black text-ink/40">
                    {String(module.number).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-teal">
                      {module.category}
                    </span>
                    <span className="mt-1 block text-lg font-black tracking-[-0.025em] text-ink">
                      {module.title}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-4 text-xs font-bold text-ink/50 sm:justify-end">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={15} /> {module.minutes} min
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-teal transition group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-20 sm:py-24">
          <div className="grid overflow-hidden border-2 border-ink bg-citrus lg:grid-cols-[1fr_0.8fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <span className="inline-flex items-center gap-2 border border-ink/20 bg-white/60 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.13em]">
                <BadgeCheck size={16} /> Built for broad care teams
              </span>
              <h2 className="mt-7 max-w-xl text-4xl font-black leading-[1.03] tracking-[-0.055em] text-ink sm:text-5xl">
                Good observation belongs to everyone.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-ink/70">
                The platform welcomes PSWs, nurses, healthcare aides, community
                support workers, supervisors, and other professionals involved
                in day-to-day physical care.
              </p>
            </div>
            <div className="flex flex-col justify-between bg-ink p-7 text-white sm:p-10 lg:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-mint">
                Ready to begin?
              </p>
              <div>
                <p className="mt-8 text-2xl font-black tracking-[-0.035em]">
                  Create an account and pick up where you left off on any device.
                </p>
                <Link
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-between border-2 border-white bg-white px-5 text-sm font-extrabold text-ink transition hover:bg-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                  href="/sign-up"
                >
                  Create account <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter lessonHref={firstLessonHref} />
    </div>
  );
}
