"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import type { CmsSalesListItem } from "@/infrastructure/repositories/PostgresCmsRepository";
import { DataTable, type TableColumn } from "@/presentation/components/cms/DataTable";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SearchField } from "@/presentation/components/cms/SearchField";

export function SalesListPage({ initialData, canWrite }: { initialData: CmsSalesListItem[]; canWrite: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialData.filter((item) => {
      const matchesQuery = !q || `${item.name} ${item.email} ${item.phone} ${item.location}`.toLowerCase().includes(q);
      return matchesQuery;
    });
  }, [initialData, query]);

  const columns: TableColumn<CmsSalesListItem>[] = [
    {
      key: "name",
      header: "Nama",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-label-md font-medium text-on-surface">{row.name}</p>
          <p className="truncate text-label-sm text-on-surface-variant">{row.email}</p>
        </div>
      ),
    },
    { key: "phone", header: "Telepon", render: (row) => <span className="text-label-md text-on-surface">{row.phone}</span> },
    { key: "location", header: "Lokasi", hideOnSmall: true, render: (row) => <span className="text-label-sm text-on-surface-variant">{row.location}</span> },
    {
      key: "created",
      header: "Dibuat",
      hideOnSmall: true,
      render: (row) => <span className="text-label-sm text-on-surface-variant">{row.createdAt}</span>,
    },
  ];

  return (
    <section>
      <PageHeader
        eyebrow="Kurata CMS"
        title="Sales & Marketing"
        description="Kelola data tim sales dan marketing Kurata."
        actions={
          canWrite ? (
            <Link href="/cms/sales/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Tambah sales
            </Link>
          ) : null
        }
      />

      <div className="mb-5">
        <SearchField value={query} onChange={setQuery} placeholder="Cari nama, email, telepon, atau lokasi..." />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card">
        <DataTable columns={columns} rows={filtered} rowKey={(row) => row.id} onRowClick={(row) => router.push(`/cms/sales/${row.id}`)} emptyMessage="Tidak ada sales yang cocok." />
      </div>
    </section>
  );
}
