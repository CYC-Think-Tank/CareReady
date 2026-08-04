import Link from "next/link";

import { Brand } from "@/components/brand";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Brand light />
          <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
            A placeholder digital learning experience for Ontario’s healthcare
            workforce. Clinical content requires formal review before delivery.
          </p>
        </div>
        <div>
          <p className="footer-heading">Platform</p>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/dashboard">Learner dashboard</Link>
            <Link href="/course/skin-changes/observe">Preview a lesson</Link>
            <Link href="/protocols">Protocol reminders</Link>
          </div>
        </div>
        <div>
          <p className="footer-heading">Important</p>
          <p className="mt-4 text-sm leading-6 text-white/65">
            This prototype is educational and does not replace workplace
            policies, clinical judgment, or emergency procedures.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 CareReady Ontario — prototype</span>
          <span>No patient or resident information should be entered.</span>
        </div>
      </div>
    </footer>
  );
}

