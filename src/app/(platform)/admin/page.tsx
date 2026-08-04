import { Eye, EyeOff, ListChecks, Pencil, Plus, SquarePen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { setModulePublished } from "@/app/(platform)/admin/actions";
import { AdminNotice, MigrationNotice } from "@/components/admin-notice";
import { checkAdminAccess } from "@/lib/admin";
import { loadModules } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Module admin",
};

type PageProps = {
  searchParams: Promise<{ created?: string; deleted?: string }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const gate = await checkAdminAccess();

  if (!gate.allowed) return <AdminNotice blocked={gate.blocked} />;

  const { deleted } = await searchParams;
  const { drafts, source } = await loadModules();
  const published = drafts.filter((draft) => draft.published).length;

  return (
    <div className="mx-auto max-w-[1260px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-14">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.055em] text-ink sm:text-5xl">
            Course modules
          </h1>
          <p className="mt-3 max-w-2xl text-base text-ink/58">
            Add a module or edit its information section and knowledge check.
            Changes go live for learners as soon as you save.
          </p>
        </div>
        <Link className="button-primary shrink-0" href="/admin/modules/new">
          <Plus size={18} /> New module
        </Link>
      </section>

      {source === "fallback" && <MigrationNotice />}

      {deleted && (
        <p
          role="status"
          className="mt-6 border-l-4 border-teal bg-mint/30 p-4 text-sm font-semibold text-ink"
        >
          Module deleted.
        </p>
      )}

      <section className="mt-9 grid gap-4 sm:grid-cols-3">
        <Stat label="Modules" value={drafts.length} />
        <Stat label="Published" value={published} />
        <Stat label="Drafts" value={drafts.length - published} />
      </section>

      <section className="mt-9">
        {drafts.length === 0 ? (
          <div className="border-2 border-dashed border-ink/25 p-10 text-center">
            <p className="text-lg font-extrabold text-ink">No modules yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
              Create the first module to give learners something to work through.
            </p>
            <Link className="button-primary mt-6" href="/admin/modules/new">
              <Plus size={18} /> New module
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {drafts.map((draft) => (
              <article
                key={draft.id}
                className="grid gap-4 border-2 border-ink bg-paper p-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-6"
              >
                <span className="grid size-11 place-items-center bg-cream text-sm font-black text-ink/50">
                  {String(draft.number).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-teal">
                      {draft.category || "Uncategorized"}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.12em] ${
                        draft.published
                          ? "bg-mint text-ink"
                          : "bg-ink/10 text-ink/55"
                      }`}
                    >
                      {draft.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-ink">
                    {draft.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/55">
                    {draft.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-ink/45">
                    <span className="inline-flex items-center gap-1.5">
                      <SquarePen size={14} />
                      {draft.information.sections.length} content block
                      {draft.information.sections.length === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ListChecks size={14} />
                      {draft.knowledgeCheck.options.length} answer options
                    </span>
                    <span className="font-mono">/{draft.id}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col">
                  <Link
                    href={`/admin/modules/${draft.id}`}
                    className="button-secondary min-h-11 px-4"
                  >
                    <Pencil size={16} /> Edit
                  </Link>
                  <form action={setModulePublished}>
                    <input type="hidden" name="moduleId" value={draft.id} />
                    <input
                      type="hidden"
                      name="published"
                      value={String(!draft.published)}
                    />
                    <button type="submit" className="button-quiet w-full">
                      {draft.published ? (
                        <>
                          <EyeOff size={16} /> Unpublish
                        </>
                      ) : (
                        <>
                          <Eye size={16} /> Publish
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink/15 bg-paper p-5">
      <p className="text-4xl font-black tracking-[-0.05em] text-ink">{value}</p>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-teal">
        {label}
      </p>
    </div>
  );
}
