import { BellRing, CalendarClock, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProtocolChecklist } from "@/components/protocol-checklist";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = { title: "Protocol checks" };

export default async function ProtocolsPage() {
  const viewer = await getViewer();

  if (isSupabaseConfigured() && !viewer.id) {
    redirect("/sign-in?next=/protocols");
  }

  let initialAcknowledged: string[] = [];
  if (viewer.id && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("protocol_acknowledgements")
      .select("protocol_id")
      .eq("user_id", viewer.id);
    initialAcknowledged = data?.map((item) => item.protocol_id) ?? [];
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
        <div>
          <p className="eyebrow">Safe practice</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-ink sm:text-5xl">
            Keep protocols close.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/62">
            Use these reminders to open the current controlled protocol—not as a
            replacement for it.
          </p>
        </div>
        <div className="border border-ink/15 bg-citrus/30 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center bg-ink text-citrus">
              <CalendarClock size={20} />
            </span>
            <div>
              <p className="text-xs font-bold text-ink/45">Suggested rhythm</p>
              <p className="mt-1 font-extrabold text-ink">Review every 60–90 days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3 border border-blue/25 bg-blue/10 p-4 text-sm leading-6 text-ink/70">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-blue" />
        <p>
          <strong className="text-ink">For the final program:</strong> replace
          each placeholder with the organization’s approved document link,
          owner, effective date, and role-specific acknowledgement rule.
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-xl font-black text-ink">
            <BellRing size={20} className="text-teal" /> Your review list
          </h2>
          <span className="text-xs font-bold text-ink/40">3 protocol checks</span>
        </div>
        <ProtocolChecklist
          viewerId={viewer.id}
          initialAcknowledged={initialAcknowledged}
        />
      </div>
    </div>
  );
}

