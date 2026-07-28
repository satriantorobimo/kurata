"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ActiveFiltersProps {
  certificates: string[];
  badges: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

interface ActiveFilter {
  key: string;
  value?: string;
  label: string;
}

function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export function ActiveFilters({
  certificates,
  badges,
  minPrice,
  maxPrice,
  minArea,
  maxArea,
}: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters: ActiveFilter[] = [
    ...certificates.map((value) => ({ key: "certificate", value, label: value })),
    ...badges.map((value) => ({
      key: "badge",
      value,
      label: value === "exclusive" ? "Exclusive Kurata" : "Broker Partner",
    })),
    ...(minPrice !== undefined ? [{ key: "minPrice", label: `Harga min. Rp ${formatNumber(minPrice)}` }] : []),
    ...(maxPrice !== undefined ? [{ key: "maxPrice", label: `Harga maks. Rp ${formatNumber(maxPrice)}` }] : []),
    ...(minArea !== undefined ? [{ key: "minArea", label: `Luas min. ${formatNumber(minArea)} m²` }] : []),
    ...(maxArea !== undefined ? [{ key: "maxArea", label: `Luas maks. ${formatNumber(maxArea)} m²` }] : []),
  ];

  if (filters.length === 0) return null;

  function navigate(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    params.delete("page");
    const suffix = params.toString();
    router.push(`/cari-tanah${suffix ? `?${suffix}` : ""}`);
  }

  function removeFilter(filter: ActiveFilter) {
    navigate((params) => {
      if (!filter.value) {
        params.delete(filter.key);
        return;
      }

      const remaining = params.getAll(filter.key).filter((value) => value !== filter.value);
      params.delete(filter.key);
      remaining.forEach((value) => params.append(filter.key, value));
    });
  }

  function clearAll() {
    navigate((params) => {
      ["certificate", "badge", "minPrice", "maxPrice", "minArea", "maxArea"].forEach(
        (key) => params.delete(key),
      );
    });
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Filter aktif">
      <span className="mr-1 text-label-sm text-on-surface-variant">Filter aktif:</span>
      {filters.map((filter) => (
        <button key={`${filter.key}-${filter.value ?? "range"}`} type="button" onClick={() => removeFilter(filter)} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-label-sm text-primary hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {filter.label}
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">Hapus filter {filter.label}</span>
        </button>
      ))}
      <button type="button" onClick={clearAll} className="px-2 py-1 text-label-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        Reset semua
      </button>
    </div>
  );
}
