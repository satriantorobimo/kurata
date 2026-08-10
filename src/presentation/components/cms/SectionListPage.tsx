"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { deleteContentSectionAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsContentSection } from "@/infrastructure/repositories/PostgresCmsRepository";
import { DataTable, type TableColumn } from "@/presentation/components/cms/DataTable";
import { ConfirmDialog } from "@/presentation/components/cms/ConfirmDialog";
import { Notice } from "@/presentation/components/cms/Notice";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SearchField } from "@/presentation/components/cms/SearchField";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";

export function SectionListPage({ initialData, canWrite }: { initialData: CmsContentSection[]; canWrite: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CmsContentSection | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialData.filter((item) => !q || `${item.section} ${item.id}`.toLowerCase().includes(q));
  }, [initialData, query]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result: CmsActionResult = await deleteContentSectionAction(deleteTarget.id);
      setDeleteTarget(null);
      setNotice(result.message ?? "Segmen dihapus.");
      router.refresh();
    });
  };

  const columns: TableColumn<CmsContentSection>[] = [
    {
      key: "section",
      header: "Segmen",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-label-md font-medium text-on-surface">{row.section}</p>
          <p className="truncate text-label-sm text-on-surface-variant">{row.id}</p>
        </div>
      ),
    },
    {
      key: "order",
      header: "Urutan",
      hideOnSmall: true,
      render: (row) => <span className="text-label-sm text-on-surface-variant">{row.position}</span>,
    },
    { key: "status", header: "Status", hideOnSmall: true, render: (row) => <StatusBadge value={row.isPublished ? "published" : "draft"} /> },
    {
      key: "updated",
      header: "Diperbarui",
      hideOnSmall: true,
      render: (row) => <span className="text-label-sm text-on-surface-variant">{row.updatedAt}</span>,
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          {canWrite ? (
            <Link href={`/cms/sections/${row.id}`} aria-label={`Edit ${row.section}`} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary">
              <Pencil className="h-4 w-4" />
            </Link>
          ) : null}
          {canWrite ? (
            <button type="button" onClick={() => setDeleteTarget(row)} aria-label={`Hapus ${row.section}`} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section>
      <PageHeader
        eyebrow="Kurata CMS"
        title="Segmen konten"
        description="Potongan konten fleksibel yang dirender komponen halaman beranda."
        actions={
          canWrite ? (
            <Link href="/cms/sections/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Tambah segmen
            </Link>
          ) : null
        }
      />
      {notice ? <Notice message={notice} onDismiss={() => setNotice("")} /> : null}

      <div className="mb-5">
        <SearchField value={query} onChange={setQuery} placeholder="Cari nama atau ID segmen..." />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card">
        <DataTable columns={columns} rows={filtered} rowKey={(row) => row.id} onRowClick={(row) => router.push(`/cms/sections/${row.id}`)} emptyMessage="Tidak ada segmen yang cocok." />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus segmen?"
        description={deleteTarget ? `“${deleteTarget.section}” akan dihapus permanen dari situs.` : undefined}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}