import {
  ArrowRight,
  Building2,
  Check,
  CircleAlert,
  FileCheck2,
  Landmark,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Ontario funding information" };

export default function FundingPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Program support</p>
        <h1 className="mt-3 text-4xl font-black leading-[1.04] tracking-[-0.055em] text-ink sm:text-5xl">
          Explore Ontario training support.
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink/62">
          A future information page for employers and learners considering
          workforce-development and job-training funding.
        </p>
      </div>

      <div className="mt-8 flex gap-3 border-l-4 border-coral bg-coral/10 p-5 text-sm leading-6 text-ink/70">
        <CircleAlert size={20} className="mt-0.5 shrink-0 text-coral" />
        <p>
          <strong className="text-ink">Placeholder only:</strong> funding
          program names, eligibility, contribution levels, and application steps
          change. This page requires verification against official Ontario
          sources before publication.
        </p>
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Building2,
            title: "For employers",
            copy: "Outline which Ontario employers may be able to seek support for short-term workforce training.",
            colour: "bg-mint",
          },
          {
            icon: UsersRound,
            title: "For learners",
            copy: "Explain whether training access is employer-sponsored, publicly supported, or independently available.",
            colour: "bg-citrus",
          },
          {
            icon: FileCheck2,
            title: "Before applying",
            copy: "Gather current program details, provider information, training dates, costs, and participant information.",
            colour: "bg-blue text-white",
          },
        ].map(({ icon: Icon, title, copy, colour }) => (
          <article key={title} className="border border-ink/15 bg-paper p-6">
            <span className={`grid size-11 place-items-center ${colour}`}>
              <Icon size={21} />
            </span>
            <h2 className="mt-6 text-xl font-black tracking-[-0.035em] text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid overflow-hidden border-2 border-ink lg:grid-cols-[1fr_0.75fr]">
        <div className="bg-paper p-6 sm:p-8">
          <p className="eyebrow">Draft application checklist</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-ink">
            Information to prepare
          </h2>
          <ul className="mt-7 grid gap-4">
            {[
              "The employer’s legal and operating information",
              "The workforce need and intended learner group",
              "The selected training provider and course outline",
              "Training schedule, tuition, and related eligible costs",
              "A plan for applying the new skills in the workplace",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink/70">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center bg-mint text-teal">
                  <Check size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between bg-ink p-6 text-white sm:p-8">
          <div>
            <Landmark size={34} className="text-citrus" />
            <h2 className="mt-6 text-2xl font-black tracking-[-0.04em]">
              Add verified Ontario guidance
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              When program details are supplied, this block will link directly
              to the official eligibility and application resources.
            </p>
          </div>
          <button
            type="button"
            className="mt-8 inline-flex min-h-12 items-center justify-between border-2 border-white/30 px-4 text-sm font-extrabold text-white/60"
            disabled
          >
            Official link pending <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <div className="mt-10 text-center">
        <p className="text-sm text-ink/55">Ready to explore the training experience?</p>
        <Link href="/dashboard" className="button-primary mt-4">
          Return to learning <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
