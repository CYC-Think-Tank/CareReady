import { CircleUserRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = { title: "Account" };

export default async function ProfilePage() {
  const viewer = await getViewer();
  if (isSupabaseConfigured() && !viewer.id) redirect("/sign-in?next=/profile");

  return (
    <div className="mx-auto max-w-[900px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-16">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-ink sm:text-5xl">
        Learner profile
      </h1>

      <div className="mt-9 grid gap-6 md:grid-cols-[1fr_18rem]">
        <section className="border-2 border-ink bg-paper p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-4 border-b border-ink/10 pb-6">
            <span className="grid size-12 place-items-center bg-mint text-teal">
              <CircleUserRound size={25} />
            </span>
            <div>
              <h2 className="text-xl font-black text-ink">Personal details</h2>
              <p className="mt-1 text-sm text-ink/50">Used on your learning dashboard.</p>
            </div>
          </div>
          <ProfileForm
            viewerId={viewer.id}
            initialName={viewer.fullName}
            initialProfession={viewer.profession}
          />
        </section>

        <aside className="space-y-5">
          <div className="border border-ink/15 bg-blue/10 p-5">
            <ShieldCheck size={23} className="text-blue" />
            <h2 className="mt-4 font-black text-ink">Privacy reminder</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              This profile is for learner details only. Do not enter patient or
              resident information.
            </p>
          </div>
          <div className="border border-ink/15 bg-paper p-5">
            <UserRound size={22} className="text-teal" />
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.14em] text-teal">
              Username
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-ink">
              {viewer.username ?? "Not available in preview"}
            </p>
          </div>
          {viewer.id && (
            <form action="/auth/signout" method="post">
              <button type="submit" className="button-quiet w-full border border-ink/15 bg-paper">
                <LogOut size={17} /> Sign out
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
