"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PropertySort } from "@/domain/repositories/IPropertyRepository";

interface SearchToolbarProps {
  total: number;
  page: number;
  totalPages: number;
  sort: PropertySort;
}

const SORT_OPTIONS: { value: PropertySort; label: string }[] = [
  { value: "recommended", label: "Rekomendasi" },
  { value: "price-asc", label: "Harga terendah" },
  { value: "price-desc", label: "Harga tertinggi" },
  { value: "area-asc", label: "Luas terkecil" },
  { value: "area-desc", label: "Luas terbesar" },
];

export function SearchToolbar({ total, page, totalPages, sort }: SearchToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    const suffix = params.toString();
    router.push(`/cari-tanah${suffix ? `?${suffix}` : ""}`);
  }

  return (
    <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-body-md text-on-surface-variant">
        <span className="font-label-md text-on-surface">{total}</span> tanah ditemukan
      </p>
      <label className="flex items-center gap-2 text-label-sm text-on-surface-variant">
        Urutkan
        <select
          value={sort}
          onChange={(event) => navigate((params) => {
            params.set("sort", event.target.value);
            params.delete("page");
          })}
          className="rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2 text-label-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      {totalPages > 1 && (
        <nav aria-label="Halaman hasil pencarian" className="flex items-center gap-2">
          <button type="button" onClick={() => navigate((params) => params.set("page", String(page - 1)))} disabled={page <= 1} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-on-surface disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Halaman sebelumnya">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-20 text-center text-label-sm text-on-surface-variant">{page} / {totalPages}</span>
          <button type="button" onClick={() => navigate((params) => params.set("page", String(page + 1)))} disabled={page >= totalPages} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-on-surface disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Halaman berikutnya">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
