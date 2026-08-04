"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteModule } from "@/app/(platform)/admin/actions";

/**
 * Two-step confirmation rather than window.confirm so the destructive action is
 * deliberate without a blocking browser dialog.
 */
export function DeleteModuleButton({
  moduleId,
  moduleTitle,
}: {
  moduleId: string;
  moduleTitle: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex min-h-11 items-center gap-2 border-2 border-coral px-4 text-sm font-extrabold text-coral transition hover:bg-coral hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
      >
        <Trash2 size={16} /> Delete module
      </button>
    );
  }

  return (
    <form action={deleteModule} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="moduleId" value={moduleId} />
      <p className="text-sm font-bold text-ink">
        Delete “{moduleTitle}” permanently?
      </p>
      <ConfirmButton />
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-sm font-extrabold text-ink/55 underline"
      >
        Keep it
      </button>
    </form>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center gap-2 border-2 border-coral bg-coral px-4 text-sm font-extrabold text-white transition hover:bg-ink hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60"
    >
      {pending ? (
        <LoaderCircle size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
      Yes, delete
    </button>
  );
}
