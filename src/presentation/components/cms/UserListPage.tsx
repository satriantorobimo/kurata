"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import type { CmsUserListItem } from "@/infrastructure/repositories/PostgresCmsRepository";
import { DataTable, type TableColumn } from "@/presentation/components/cms/DataTable";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SearchField } from "@/presentation/components/cms/SearchField";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";

const ROLE_OPTIONS = [
  { value: "", label: "Semua peran" },
  { value: "user", label: "Pengguna" },
  { value: "broker", label: "Mitra Kurata" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Master Admin" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Semua status" },
  { value: "active", label: "Aktif" },
  { value: "suspended", label: "Ditangguhkan" },
  { value: "archived", label: "Diarsipkan" },
];

export function UserListPage({ initialData, canWrite }: { initialData: CmsUserListItem[]; canWrite: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialData.filter((item) => {
      const matchesQuery = !q || `${item.fullName} ${item.email} ${item.phone ?? ""}`.toLowerCase().includes(q);
      const matchesRole = !role || item.role === role;
      const matchesStatus = !status || item.status === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [initialData, query, role, status]);

  const columns: TableColumn<CmsUserListItem>[] = [
    {
      key: "person",
      header: "Pengguna",
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-label-md font-medium text-on-surface">{row.fullName}</p>
          <p className="truncate text-label-sm text-on-surface-variant">{row.email}</p>
        </div>
      ),
    },
    { key: "role", header: "Peran", render: (row) => <StatusBadge value={row.role} /> },
    { key: "status", header: "Status", hideOnSmall: true, render: (row) => <StatusBadge value={row.status} /> },
    { key: "verified", header: "Email terverifikasi", hideOnSmall: true, render: (row) => (row.emailVerifiedAt ? <StatusBadge value="verified" /> : <StatusBadge value="false" />) },
    {
      key: "created",
      header: "Terdaftar",
      hideOnSmall: true,
      render: (row) => <span className="text-label-sm text-on-surface-variant">{row.createdAt}</span>,
    },
  ];

  return (
    <section>
      <PageHeader
        eyebrow="Kurata CMS"
        title="Pengguna"
        description="Kelola akun pengunjung, Mitra Kurata, dan staf."
        actions={
          canWrite ? (
            <Link href="/cms/users/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Tambah pengguna
            </Link>
          ) : null
        }
      />

      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <SearchField value={query} onChange={setQuery} placeholder="Cari nama, email, atau telepon..." />
        <div className="flex flex-wrap gap-3">
          <select value={role} onChange={(event) => setRole(event.target.value)} aria-label="Filter peran" className="rounded-xl border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary">
            {ROLE_OPTIONS.map((option) => (
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
        <DataTable columns={columns} rows={filtered} rowKey={(row) => row.id} onRowClick={(row) => router.push(`/cms/users/${row.id}`)} emptyMessage="Tidak ada pengguna yang cocok." />
      </div>
    </section>
  );
}