import Link from "next/link";

import { Brand } from "@/components/brand";

export function PublicHeader() {
  return (
    <header className="border-b border-ink/10 bg-cream/95">
      <div className="page-shell flex min-h-20 items-center justify-between gap-6">
        <Brand />
        <nav
          className="hidden items-center gap-7 text-sm font-bold text-ink/70 md:flex"
          aria-label="Main navigation"
        >
          <a className="nav-link" href="#course">
            Course
          </a>
          <a className="nav-link" href="#approach">
            How it works
          </a>
          <Link className="nav-link" href="/funding">
            Funding
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="button-quiet hidden min-h-11 px-4 sm:inline-flex" href="/sign-in">
            Sign in
          </Link>
          <Link className="button-primary min-h-11 px-4 sm:px-5" href="/sign-up">
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}
