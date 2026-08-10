"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

import { deleteBlogAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsBlogListItem } from "@/infrastructure/repositories/PostgresCmsRepository";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from "@/domain/entities/BlogArticle";
import { DataTable, type TableColumn } from "@/presentation/components/cms/DataTable";
import { ConfirmDialog } from "@/presentation/components/cms/ConfirmDialog";
import { Notice } from "@/presentation/components/cms/Notice";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SearchField } from "@/presentation/components/cms/SearchField";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";

export function BlogListPage({ initialData, canWrite }: { initialData: CmsBlogListItem[]; canWrite: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CmsBlogListItem | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialData.filter((item) => {
      const matchesQuery = !q || `${item.title} ${item.author}`.toLowerCase().includes(q);
      const matchesCategory = !category || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [initialData, query, category]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result: CmsActionResult = await deleteBlogAction(deleteTarget.slug);
      setDeleteTarget(null);
      setNotice(result.message ?? "Selesai.");
      router.refresh();
    });
  };

  const columns: TableColumn<CmsBlogListItem>[] = [
    {
      key: "article",
      header: "Artikel",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-label-md font-medium text-on-surface">{row.title}</p>
          <p className="truncate text-label-sm text-on-surface-variant">/{row.slug} · {row.author}</p>
        </div>
      ),
    },
    { key: "category", header: "Kategori", hideOnSmall: true, render: (row) => <span className="text-label-sm text-on-surface-variant">{BLOG_CATEGORY_LABELS[row.category as keyof typeof BLOG_CATEGORY_LABELS] ?? row.category}</span> },
    { key: "publishedAt", header: "Terbit", hideOnSmall: true, render: (row) => <span className="text-label-sm text-on-surface-variant">{row.publishedAt}</span> },
    {
      key: "flags",
      header: "Status",
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge value={row.isPublished ? "published" : "draft"} />
          {row.isFeatured ? <StatusBadge value="true" label="Unggulan" className="bg-violet-100 text-violet-800" /> : null}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row) =>
        canWrite ? (
          <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setDeleteTarget(row)} aria-label={`Hapus ${row.title}`} className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : null,
    },
  ];

  return (
    <section>
      <PageHeader
        eyebrow="Kurata CMS"
        title="Artikel blog"
        description="Kelola artikel, kategori, dan status tayang konten Kurata."
        actions={
          canWrite ? (
            <Link href="/cms/blog/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Tulis artikel
            </Link>
          ) : null
        }
      />
      {notice ? <Notice message={notice} onDismiss={() => setNotice("")} /> : null}

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SearchField value={query} onChange={setQuery} placeholder="Cari judul atau penulis..." />
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter kategori" className="rounded-xl border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary">
          <option value="">Semua kategori</option>
          {BLOG_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {BLOG_CATEGORY_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card">
        <DataTable columns={columns} rows={filtered} rowKey={(row) => row.slug} onRowClick={(row) => router.push(`/cms/blog/${row.slug}`)} emptyMessage="Tidak ada artikel yang cocok." />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus artikel?"
        description={deleteTarget ? `“${deleteTarget.title}” dan seluruh isinya akan dihapus permanen.` : undefined}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}