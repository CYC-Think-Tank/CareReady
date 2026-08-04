"use client";

import { ArrowRight, CircleAlert, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { safeRedirectPath } from "@/lib/safe-redirect";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";
import {
  isValidUsername,
  normalizeUsername,
  usernameToInternalEmail,
} from "@/lib/username-account";

function friendlyAuthError(message: string, isSignUp: boolean) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("already registered") ||
    normalized.includes("already been registered") ||
    normalized.includes("user already exists")
  ) {
    return "That username is already taken.";
  }

  if (
    !isSignUp &&
    (normalized.includes("invalid login") ||
      normalized.includes("invalid credentials"))
  ) {
    return "The username or password is incorrect.";
  }

  return message;
}

async function registrationIsReady() {
  const { url, publishableKey } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: publishableKey },
  });

  if (!response.ok) return null;
  const settings = (await response.json()) as { mailer_autoconfirm?: boolean };
  return settings.mailer_autoconfirm === true;
}

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
  const [setupRequired, setSetupRequired] = useState(false);
  const [username, setUsername] = useState("");
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setSetupRequired(false);

    if (!configured) {
      setMessage("The learner account service has not been connected yet.");
      return;
    }

    const normalizedUsername = normalizeUsername(username);
    if (!isValidUsername(normalizedUsername)) {
      setMessage(
        "Choose a username with 3–30 lowercase letters, numbers, periods, hyphens, or underscores.",
      );
      return;
    }

    setLoading(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const internalEmail = usernameToInternalEmail(normalizedUsername);
    const supabase = createClient();

    if (isSignUp) {
      const ready = await registrationIsReady();
      if (ready !== true) {
        setSetupRequired(true);
        setMessage(
          ready === false
            ? "Account creation needs one administrator setting. Disable “Confirm email” in Supabase Authentication, then try again."
            : "The account settings could not be verified. Check the Supabase connection and try again.",
        );
        setLoading(false);
        return;
      }

      const fullName = String(form.get("fullName") ?? "").trim();
      const profession = String(
        form.get("profession") ?? "Healthcare professional",
      );
      const { data, error } = await supabase.auth.signUp({
        email: internalEmail,
        password,
        options: {
          data: {
            username: normalizedUsername,
            full_name: fullName,
            profession,
          },
        },
      });

      if (error) {
        setMessage(friendlyAuthError(error.message, true));
      } else if (!data.session) {
        setSetupRequired(true);
        setMessage(
          "Account creation is waiting for an administrator setting. Disable “Confirm email” in Supabase Authentication, then try signing in.",
        );
      } else {
        const next = safeRedirectPath(searchParams.get("next"), "/dashboard");
        router.push(next);
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password,
      });
      if (error) {
        setMessage(friendlyAuthError(error.message, false));
      } else {
        const next = safeRedirectPath(searchParams.get("next"), "/dashboard");
        router.push(next);
        router.refresh();
      }
    }
    setLoading(false);
  }

  if (setupRequired) {
    return (
      <div className="border-2 border-ink bg-paper p-7 shadow-[7px_7px_0_0_var(--citrus)]">
        <span className="grid size-12 place-items-center bg-citrus text-ink">
          <LockKeyhole size={23} />
        </span>
        <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-ink">
          One project setting remains
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">{message}</p>
        <p className="mt-3 text-xs leading-5 text-ink/50">
          Learners will still use only a username and password. No email address
          is collected or verified.
        </p>
        <Link href="/sign-in" className="button-primary mt-7 w-full">
          Go to sign in <ArrowRight size={18} />
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
            <select
              className="text-field"
              id="profession"
              name="profession"
              defaultValue="Personal Support Worker"
            >
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
        <label className="field-label" htmlFor="username">
          Username
        </label>
        <input
          className="text-field"
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          minLength={3}
          maxLength={30}
          pattern="[a-z0-9][a-z0-9_-]*(?:\.[a-z0-9_-]+)*"
          placeholder="alex.morgan"
          value={username}
          onChange={(event) => setUsername(event.target.value.toLowerCase())}
          required
        />
        {isSignUp && (
          <p className="mt-2 text-xs leading-5 text-ink/45">
            Use 3–30 lowercase letters, numbers, periods, hyphens, or underscores.
          </p>
        )}
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-sm font-bold text-ink" htmlFor="password">
            Password
          </label>
          {!isSignUp && (
            <span className="text-right text-xs font-bold text-ink/40">
              Ask an administrator to reset it
            </span>
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
        <div
          className="flex gap-3 border-l-4 border-coral bg-coral/10 p-4 text-sm leading-6 text-ink/70"
          role="alert"
        >
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

      <button
        type="submit"
        className="button-secondary mt-1 w-full"
        disabled={loading}
      >
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
