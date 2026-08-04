import { ShieldAlert } from "lucide-react";
import Link from "next/link";

import type { AdminGate } from "@/lib/admin";

const copy = {
  unconfigured: {
    title: "Supabase is not connected",
    body: "Module editing writes to the database, so it needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment.",
  },
  forbidden: {
    title: "You do not have admin access",
    body: "Ask an existing admin to set is_admin to true on your row in the profiles table.",
  },
} as const;

export function AdminNotice({ blocked }: { blocked: NonNullable<AdminGate["blocked"]> }) {
  const { title, body } = copy[blocked];

  return (
    <div className="mx-auto max-w-[1260px] px-5 py-12 sm:px-8">
      <div className="max-w-2xl border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_var(--coral)] sm:p-8">
        <span className="grid size-11 place-items-center bg-coral text-white">
          <ShieldAlert size={22} />
        </span>
        <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-ink">{title}</h1>
        <p className="mt-3 text-base leading-7 text-ink/60">{body}</p>
        <Link href="/dashboard" className="button-secondary mt-7">
          Back to my learning
        </Link>
      </div>
    </div>
  );
}

export function MigrationNotice() {
  return (
    <div className="mt-6 flex gap-3 border-l-4 border-coral bg-coral/10 p-4 text-sm leading-6 text-ink/70">
      <ShieldAlert size={19} className="mt-0.5 shrink-0 text-coral" />
      <p>
        <strong className="text-ink">Showing bundled content.</strong> The{" "}
        <code className="bg-ink/10 px-1">modules</code> table could not be read, so
        these are the modules compiled into the app. Apply{" "}
        <code className="bg-ink/10 px-1">
          supabase/migrations/202608040002_admin_authored_modules.sql
        </code>{" "}
        before editing.
      </p>
    </div>
  );
}
