import { Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";

export function AuthPage({
  mode,
  configured,
}: {
  mode: "sign-in" | "sign-up";
  configured: boolean;
}) {
  const isSignUp = mode === "sign-up";
  return (
    <main className="grid min-h-screen bg-cream lg:grid-cols-[0.88fr_1.12fr]">
      <section className="flex flex-col bg-ink p-6 text-white sm:p-10 lg:p-12">
        <Brand light />
        <div className="my-auto max-w-xl py-14 lg:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-mint">
            Ontario healthcare workforce development
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl">
            {isSignUp
              ? "Your learning, ready for the next shift."
              : "Welcome back to practical learning."}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/60">
            Learn in short sessions, revisit workplace protocols, and keep your
            progress private in one accessible training platform.
          </p>
          <ul className="mt-9 grid gap-4">
            {[
              "Seven focused physical-health modules",
              "Short scenarios and knowledge checks",
              "Progress saved to your learner account",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm font-bold text-white/75"
              >
                <span className="grid size-7 place-items-center bg-citrus text-ink">
                  <Check size={15} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-white/45">
          <ShieldCheck size={18} className="shrink-0 text-mint" />
          Do not enter patient or resident health information.
        </div>
      </section>

      <section className="flex items-center justify-center p-5 py-12 sm:p-10">
        <div className="w-full max-w-[470px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-teal"
          >
            ← Back to program overview
          </Link>
          <p className="eyebrow mt-9">
            {isSignUp ? "Create account" : "Learner sign in"}
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-ink">
            {isSignUp ? "Start learning." : "Continue learning."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/55">
            {isSignUp
              ? "Choose a username and password to save your course and protocol-check progress."
              : "Enter your username and password to return to your dashboard."}
          </p>
          <div className="mt-8">
            <Suspense
              fallback={<div className="h-80 border border-ink/10 bg-paper" />}
            >
              <AuthForm mode={mode} configured={configured} />
            </Suspense>
          </div>
          <div className="mt-7 border-t border-ink/10 pt-6 text-center">
            <Link
              href="/dashboard"
              className="text-sm font-extrabold text-blue underline underline-offset-4"
            >
              Explore the dashboard preview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
