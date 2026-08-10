"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { CmsForm } from "@/infrastructure/repositories/PostgresCmsRepository";
import { DataTable, type TableColumn } from "@/presentation/components/cms/DataTable";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SearchField } from "@/presentation/components/cms/SearchField";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";

const FORM_TYPE_OPTIONS = [
  { value: "", label: "Semua jenis" },
  { value: "broker_application", label: "Pengajuan mitra" },
  { value: "service_inquiry", label: "Konsultasi layanan" },
  { value: "investment_inquiry", label: "Minat investasi" },
  { value: "support_request", label: "Permintaan bantuan" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Semua status" },
  { value: "pending", label: "Menunggu" },
  { value: "under_review", label: "Ditinjau" },
  { value: "changes_requested", label: "Perlu perbaikan" },
  { value: "rejected", label: "Ditolak" },
  { value: "completed", label: "Selesai" },
];

export function FormListPage({ initialData }: { initialData: CmsForm[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [formType, setFormType] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialData.filter((item) => {
      const matchesQuery = !q || `${item.fullName} ${item.email} ${item.phone ?? ""}`.toLowerCase().includes(q);
      const matchesType = !formType || item.formType === formType;
      const matchesStatus = !status || item.reviewStatus === status;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [initialData, query, formType, status]);

  const columns: TableColumn<CmsForm>[] = [
    {
      key: "person",
      header: "Pengirim",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-label-md font-medium text-on-surface">{row.fullName}</p>
          <p className="truncate text-label-sm text-on-surface-variant">{row.email}</p>
        </div>
      ),
    },
    { key: "type", header: "Jenis", render: (row) => <StatusBadge value={row.formType} /> },
    { key: "status", header: "Status", hideOnSmall: true, render: (row) => <StatusBadge value={row.reviewStatus} /> },
    {
      key: "created",
      header: "Dikirim",
      hideOnSmall: true,
      render: (row) => <span className="text-label-sm text-on-surface-variant">{row.createdAt}</span>,
    },
  ];

  return (
    <section>
      <PageHeader eyebrow="Kurata CMS" title="Pengajuan form" description="Tanggapan pengunjung dari seluruh form situs." />

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SearchField value={query} onChange={setQuery} placeholder="Cari nama, email, atau telepon..." />
        <div className="flex flex-wrap gap-3">
          <select value={formType} onChange={(event) => setFormType(event.target.value)} aria-label="Filter jenis form" className="rounded-xl border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary">
            {FORM_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status" className="rounded-xl border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary">
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card">
        <DataTable columns={columns} rows={filtered} rowKey={(row) => row.id} onRowClick={(row) => router.push(`/cms/forms/${row.id}`)} emptyMessage="Tidak ada pengajuan yang cocok." />
      </div>
    </section>
  );
}