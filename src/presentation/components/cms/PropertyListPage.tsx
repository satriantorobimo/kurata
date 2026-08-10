"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { deletePropertyAction, setPropertyReviewStatusAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsProperty } from "@/infrastructure/repositories/PostgresCmsRepository";
import { DataTable, type TableColumn } from "@/presentation/components/cms/DataTable";
import { ConfirmDialog } from "@/presentation/components/cms/ConfirmDialog";
import { Notice } from "@/presentation/components/cms/Notice";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SearchField } from "@/presentation/components/cms/SearchField";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";
import { formatRupiah } from "@/presentation/components/cms/format";

const STATUS_OPTIONS = [
  { value: "", label: "Semua status" },
  { value: "published", label: "Tayang" },
  { value: "draft", label: "Draf" },
  { value: "pending", label: "Menunggu" },
  { value: "under_review", label: "Ditinjau" },
  { value: "changes_requested", label: "Perlu perbaikan" },
  { value: "rejected", label: "Ditolak" },
];

const STATUS_CHOICES = [
  { value: "draft", label: "Draf" },
  { value: "pending", label: "Menunggu" },
  { value: "published", label: "Tayang" },
  { value: "rejected", label: "Ditolak" },
];

export function PropertyListPage({ initialData, canWrite }: { initialData: CmsProperty[]; canWrite: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CmsProperty | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialData.filter((item) => {
      const shownStatus = item.isPublished ? "published" : item.reviewStatus;
      const matchesQuery = !q || `${item.title} ${item.city} ${item.province}`.toLowerCase().includes(q);
      const matchesStatus = !status || shownStatus === status;
      return matchesQuery && matchesStatus;
    });
  }, [initialData, query, status]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result: CmsActionResult = await deletePropertyAction(deleteTarget.id);
      setDeleteTarget(null);
      setNotice(result.message ?? "Action selesai.");
      router.refresh();
    });
  };

  const updateStatus = (propertyId: string, nextStatus: string) => {
    startTransition(async () => {
      const result: CmsActionResult = await setPropertyReviewStatusAction(propertyId, nextStatus);
      setNotice(result.message ?? "Status diperbarui.");
      router.refresh();
    });
  };

  const columns: TableColumn<CmsProperty>[] = [
    {
      key: "property",
      header: "Aset",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-container-high bg-cover bg-center" style={row.imageUrl ? { backgroundImage: `url(${row.imageUrl})` } : undefined} />
          <div className="min-w-0">
            <p className="truncate text-label-md font-medium text-on-surface">{row.title}</p>
            <p className="truncate text-label-sm text-on-surface-variant">{row.city}, {row.province}</p>
          </div>
        </div>
      ),
    },
    {
      key: "detail",
      header: "Detail",
      hideOnSmall: true,
      render: (row) => (
        <div className="text-label-sm text-on-surface-variant">
          <p>{formatRupiah(row.priceAmount)}</p>
          <p>{row.areaSqm.toLocaleString("id-ID")} m² · {row.certificate}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", hideOnSmall: true, render: (row) => <StatusBadge value={row.isPublished ? "published" : row.reviewStatus} /> },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          {canWrite ? (
            <select
              value={row.isPublished ? "published" : row.reviewStatus}
              onChange={(event) => updateStatus(row.id, event.target.value)}
              aria-label={`Ubah status ${row.title}`}
              className="rounded-lg border border-border-subtle bg-surface-container-lowest px-2 py-1.5 text-label-sm text-on-surface outline-none focus:border-primary"
            >
              {STATUS_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          ) : null}
          {canWrite ? (
            <button type="button" onClick={() => setDeleteTarget(row)} aria-label={`Hapus ${row.title}`} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container">
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
        title="Aset"
        description="Kelola listing tanah, termasuk pengajuan dari Mitra Kurata."
        actions={
          canWrite ? (
            <Link href="/cms/properties/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Tambah aset
            </Link>
          ) : null
        }
      />
      {notice ? <Notice message={notice} onDismiss={() => setNotice("")} /> : null}

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SearchField value={query} onChange={setQuery} placeholder="Cari nama, kota, atau provinsi..." />
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status" className="rounded-xl border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary">
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card">
        <DataTable columns={columns} rows={filtered} rowKey={(row) => row.id} onRowClick={(row) => router.push(`/cms/properties/${row.id}`)} emptyMessage="Tidak ada aset yang cocok." />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus aset?"
        description={deleteTarget ? `“${deleteTarget.title}” akan dihapus permanen beserta foto galerinya.` : undefined}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}