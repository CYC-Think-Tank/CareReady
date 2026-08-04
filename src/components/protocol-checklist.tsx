"use client";

import { BellRing, Check, ExternalLink, LoaderCircle, RotateCcw } from "lucide-react";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const protocols = [
  {
    id: "skin-observation",
    tag: "Skin health",
    title: "Skin observation and escalation",
    description:
      "Confirm where to record a new skin change, who must be notified, and the required timeframe.",
    review: "Review every 90 days",
    accent: "border-mint",
  },
  {
    id: "fall-prevention",
    tag: "Fall prevention",
    title: "Mobility and fall-risk changes",
    description:
      "Recheck the steps to follow when a person’s strength, balance, alertness, or usual mobility changes.",
    review: "Review every 90 days",
    accent: "border-citrus",
  },
  {
    id: "post-fall",
    tag: "Fall response",
    title: "Post-fall response",
    description:
      "Locate the current emergency contacts, assessment pathway, documentation, and follow-up responsibilities.",
    review: "Review every 60 days",
    accent: "border-coral",
  },
];

export function ProtocolChecklist({
  viewerId,
  initialAcknowledged,
}: {
  viewerId: string | null;
  initialAcknowledged: string[];
}) {
  const [acknowledged, setAcknowledged] = useState(new Set(initialAcknowledged));
  const [savingId, setSavingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function acknowledge(protocolId: string) {
    setSavingId(protocolId);
    setStatus(null);

    if (!viewerId || !isSupabaseConfigured()) {
      setAcknowledged((current) => new Set(current).add(protocolId));
      setStatus("Acknowledged for this preview. Connect Supabase to save it to an account.");
      setSavingId(null);
      return;
    }

    const reviewDue = new Date();
    reviewDue.setDate(reviewDue.getDate() + 90);
    const supabase = createClient();
    const { error } = await supabase.from("protocol_acknowledgements").upsert(
      {
        user_id: viewerId,
        protocol_id: protocolId,
        acknowledged_at: new Date().toISOString(),
        review_due_at: reviewDue.toISOString(),
      },
      { onConflict: "user_id,protocol_id" },
    );

    if (error) {
      setStatus("The acknowledgement could not be saved. Please try again.");
    } else {
      setAcknowledged((current) => new Set(current).add(protocolId));
      setStatus("Protocol review acknowledged and saved.");
    }
    setSavingId(null);
  }

  return (
    <div>
      {status && (
        <div className="mb-5 border-l-4 border-blue bg-blue/10 p-4 text-sm font-semibold text-ink/70" role="status">
          {status}
        </div>
      )}
      <div className="grid gap-5">
        {protocols.map((protocol) => {
          const isDone = acknowledged.has(protocol.id);
          return (
            <article
              key={protocol.id}
              className={`grid gap-6 border-l-[7px] border-y border-r bg-paper p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6 ${protocol.accent} ${
                isDone ? "border-y-teal/30 border-r-teal/30" : "border-y-ink/15 border-r-ink/15"
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`grid size-11 shrink-0 place-items-center ${
                    isDone ? "bg-teal text-white" : "bg-cream text-ink/55"
                  }`}
                >
                  {isDone ? <Check size={21} /> : <BellRing size={21} />}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-teal">
                      {protocol.tag}
                    </span>
                    <span className="text-xs font-semibold text-ink/40">{protocol.review}</span>
                  </div>
                  <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-ink">
                    {protocol.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                    {protocol.description}
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-blue underline decoration-blue/30 underline-offset-4"
                    onClick={() =>
                      setStatus(
                        "Protocol links are placeholders. Add the organization’s controlled document URL before launch.",
                      )
                    }
                  >
                    Locate workplace protocol <ExternalLink size={15} />
                  </button>
                </div>
              </div>
              <button
                type="button"
                disabled={isDone || savingId === protocol.id}
                onClick={() => acknowledge(protocol.id)}
                className={`inline-flex min-h-11 items-center justify-center gap-2 border-2 px-4 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${
                  isDone
                    ? "cursor-default border-teal/20 bg-mint/30 text-teal"
                    : "border-ink bg-white text-ink hover:bg-citrus"
                }`}
              >
                {savingId === protocol.id ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : isDone ? (
                  <Check size={17} />
                ) : (
                  <RotateCcw size={17} />
                )}
                {isDone ? "Reviewed" : "Mark reviewed"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

