import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminNotice } from "@/components/admin-notice";
import { ModuleEditor } from "@/components/module-editor";
import { checkAdminAccess } from "@/lib/admin";
import { emptyModuleDraft } from "@/lib/module-schema";
import { getModuleDrafts } from "@/lib/modules";

export const metadata: Metadata = {
  title: "New module",
};

export default async function NewModulePage() {
  const gate = await checkAdminAccess("/admin/modules/new");

  if (!gate.allowed) return <AdminNotice blocked={gate.blocked} />;

  const drafts = await getModuleDrafts();
  const nextNumber = drafts.reduce((highest, draft) => Math.max(highest, draft.number), 0) + 1;

  return (
    <div className="mx-auto max-w-[900px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-14">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink/50 hover:text-teal"
      >
        <ArrowLeft size={15} /> All modules
      </Link>
      <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] text-ink sm:text-5xl">
        New module
      </h1>
      <p className="mt-3 max-w-2xl text-base text-ink/58">
        A module is one information lesson followed by one knowledge check.
      </p>

      <div className="mt-9">
        <ModuleEditor initialDraft={emptyModuleDraft(nextNumber)} isNew />
      </div>
    </div>
  );
}
