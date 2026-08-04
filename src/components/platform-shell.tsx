import {
  BellRing,
  BookOpenText,
  CircleUserRound,
  LayoutDashboard,
  LogIn,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

import { Brand } from "@/components/brand";
import type { Viewer } from "@/lib/viewer";

const navigation = [
  { href: "/dashboard", label: "My learning", icon: LayoutDashboard },
  {
    href: "/course/skin-changes/observe",
    label: "Course modules",
    icon: BookOpenText,
  },
  { href: "/protocols", label: "Protocol checks", icon: BellRing },
  { href: "/funding", label: "Funding info", icon: WalletCards },
];

export function PlatformShell({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer: Viewer;
}) {
  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r border-white/10 bg-ink px-5 py-6 text-white lg:flex lg:flex-col">
        <Brand light />
        <nav className="mt-12 grid gap-2" aria-label="Learner navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-12 items-center gap-3 border-l-2 border-transparent px-3 text-sm font-bold text-white/65 transition hover:border-citrus hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus"
            >
              <Icon size={19} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-5">
          {viewer.isDemo && (
            <span className="mb-4 inline-flex border border-citrus/50 bg-citrus/10 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-citrus">
              Preview mode
            </span>
          )}
          <Link
            href={viewer.id ? "/profile" : "/sign-in?next=/profile"}
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus"
          >
            <span className="grid size-10 place-items-center bg-white/10 text-mint">
              {viewer.id || viewer.isDemo ? (
                <CircleUserRound size={21} />
              ) : (
                <LogIn size={21} />
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">
                {viewer.fullName}
              </span>
              <span className="mt-1 block truncate text-xs text-white/50">
                {viewer.isDemo ? "Demo learner" : viewer.profession}
              </span>
            </span>
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-ink/10 bg-cream/95 px-5 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <span className="hidden text-xs font-extrabold uppercase tracking-[0.16em] text-teal lg:block">
            Physical healthcare training
          </span>
          <div className="flex items-center gap-2">
            {viewer.isDemo && (
              <span className="hidden border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold text-ink/65 sm:inline-flex">
                Preview data
              </span>
            )}
            <Link
              href={viewer.id ? "/profile" : "/sign-in?next=/profile"}
              className="button-quiet min-h-10 px-3"
            >
              <CircleUserRound size={18} />
              <span className="hidden sm:inline">
                {viewer.id ? "Profile" : "Sign in"}
              </span>
            </Link>
          </div>
        </header>
        <main>{children}</main>
        <nav
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-ink/10 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
          aria-label="Mobile learner navigation"
        >
          {navigation.slice(0, 4).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-12 flex-col items-center justify-center gap-1 text-[0.62rem] font-bold text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label.split(" ")[0]}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
