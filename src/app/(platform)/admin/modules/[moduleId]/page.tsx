import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminNotice, MigrationNotice } from "@/components/admin-notice";
import { DeleteModuleButton } from "@/components/delete-module-button";
import { ModuleEditor } from "@/components/module-editor";
import { checkAdminAccess } from "@/lib/admin";
import { loadModules } from "@/lib/modules";

type PageProps = {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ created?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId } = await params;
  return { title: `Edit ${moduleId}` };
}

export default async function EditModulePage({ params, searchParams }: PageProps) {
  const { moduleId } = await params;
  const gate = await checkAdminAccess(`/admin/modules/${moduleId}`);

  if (!gate.allowed) return <AdminNotice blocked={gate.blocked} />;

  const { created } = await searchParams;
  const { drafts, source } = await loadModules();
  const draft = drafts.find((item) => item.id === moduleId);

  if (!draft) notFound();

  return (
    <div className="mx-auto max-w-[900px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-14">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink/50 hover:text-teal"
      >
        <ArrowLeft size={15} /> All modules
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Editing module {String(draft.number).padStart(2, "0")}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-ink sm:text-5xl">
            {draft.title}
          </h1>
        </div>
        <Link
          href={`/course/${draft.id}/${draft.information.id}`}
          className="button-quiet shrink-0"
        >
          <ExternalLink size={16} /> Preview lesson
        </Link>
      </div>

      {source === "fallback" && <MigrationNotice />}

      {created && (
        <p
          role="status"
          className="mt-6 border-l-4 border-teal bg-mint/30 p-4 text-sm font-semibold text-ink"
        >
          Module created. Keep editing below, or head back to the module list.
        </p>
      )}

      <div className="mt-9">
        <ModuleEditor initialDraft={draft} isNew={false} />
      </div>

      <section className="mt-12 border-2 border-coral/40 bg-coral/5 p-5 sm:p-7">
        <h2 className="text-lg font-black text-ink">Danger zone</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink/60">
          Deleting removes the module for every learner. Their recorded progress
          rows stay in the database but will no longer map to a lesson. Unpublish
          instead if you only want to hide it.
        </p>
        <div className="mt-5">
          <DeleteModuleButton moduleId={draft.id} moduleTitle={draft.title} />
        </div>
      </section>
    </div>
  );
}
