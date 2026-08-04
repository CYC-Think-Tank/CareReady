"use client";

import { ArrowRight, CircleAlert, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { safeRedirectPath } from "@/lib/safe-redirect";

export function AuthForm({
  mode,
  configured,
}: {
  mode: "sign-in" | "sign-up";
  configured: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!configured) {
      setMessage("Supabase credentials are required to activate learner accounts.");
      return;
    }

    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const supabase = createClient();

    if (isSignUp) {
      const fullName = String(form.get("fullName") ?? "").trim();
      const profession = String(form.get("profession") ?? "Healthcare professional");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: { full_name: fullName, profession },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setConfirmation(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        const next = safeRedirectPath(searchParams.get("next"), "/dashboard");
        router.push(next);
        router.refresh();
      }
    }
    setLoading(false);
  }

  if (confirmation) {
    return (
      <div className="border-2 border-ink bg-paper p-7 shadow-[7px_7px_0_0_var(--citrus)]">
        <span className="grid size-12 place-items-center bg-mint text-teal">
          <LockKeyhole size={23} />
        </span>
        <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-ink">
          Check your inbox
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          We sent a confirmation link to your email address. Open it to activate
          your learner account and begin saving progress.
        </p>
        <Link href="/sign-in" className="button-primary mt-7 w-full">
          Return to sign in <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {isSignUp && (
        <>
          <div>
            <label className="field-label" htmlFor="fullName">
              Full name
            </label>
            <input
              className="text-field"
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Alex Morgan"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="profession">
              Your role
            </label>
            <select className="text-field" id="profession" name="profession" defaultValue="Personal Support Worker">
              <option>Personal Support Worker</option>
              <option>Nurse</option>
              <option>Healthcare aide</option>
              <option>Community support worker</option>
              <option>Supervisor or educator</option>
              <option>Other healthcare professional</option>
            </select>
          </div>
        </>
      )}
      <div>
        <label className="field-label" htmlFor="email">
          Email address
        </label>
        <input
          className="text-field"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="alex@example.ca"
          required
        />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-ink" htmlFor="password">
            Password
          </label>
          {!isSignUp && (
            <span className="text-xs font-bold text-ink/40">Reset flow coming soon</span>
          )}
        </div>
        <input
          className="text-field"
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={8}
          placeholder="At least 8 characters"
          required
        />
      </div>

      {message && (
        <div className="flex gap-3 border-l-4 border-coral bg-coral/10 p-4 text-sm leading-6 text-ink/70" role="alert">
          <CircleAlert size={18} className="mt-0.5 shrink-0 text-coral" />
          <p>{message}</p>
        </div>
      )}

      {!configured && (
        <div className="border border-blue/25 bg-blue/10 p-4 text-xs leading-5 text-ink/65">
          Account screens are in preview mode. Add the Supabase project URL and
          publishable key to enable registration and secure progress saving.
        </div>
      )}

      <button type="submit" className="button-secondary mt-1 w-full" disabled={loading}>
        {loading ? <LoaderCircle size={18} className="animate-spin" /> : null}
        {isSignUp ? "Create learner account" : "Sign in to learning"}
        {!loading && <ArrowRight size={18} />}
      </button>

      <p className="text-center text-sm text-ink/55">
        {isSignUp ? "Already have an account?" : "New to CareReady?"}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-extrabold text-teal underline decoration-teal/30 underline-offset-4"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
