"use client";

import { FormEvent, useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CERTIFICATES = ["SHM", "HGB", "HGU", "HP"] as const;
const BADGES = [
  { value: "exclusive", label: "Exclusive Kurata" },
  { value: "broker", label: "Broker Partner" },
] as const;

interface PropertyFiltersProps {
  certificates: string[];
  badges: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

export function PropertyFilters({
  certificates,
  badges,
  minPrice,
  maxPrice,
  minArea,
  maxArea,
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceMin, setPriceMin] = useState(minPrice?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(maxPrice?.toString() ?? "");
  const [areaMin, setAreaMin] = useState(minArea?.toString() ?? "");
  const [areaMax, setAreaMax] = useState(maxArea?.toString() ?? "");

  function updateParams(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    params.delete("page");
    const suffix = params.toString();
    router.push(`/cari-tanah${suffix ? `?${suffix}` : ""}`);
  }

  function toggleMultiValue(key: "certificate" | "badge", value: string) {
    updateParams((params) => {
      const values = params.getAll(key);
      params.delete(key);
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];
      nextValues.forEach((item) => params.append(key, item));
    });
  }

  function applyRanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParams((params) => {
      const rangeValues = [
        ["minPrice", priceMin],
        ["maxPrice", priceMax],
        ["minArea", areaMin],
        ["maxArea", areaMax],
      ] as const;

      rangeValues.forEach(([key, value]) => {
        if (value && Number(value) >= 0) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
    });
  }

  function resetFilters() {
    setPriceMin("");
    setPriceMax("");
    setAreaMin("");
    setAreaMax("");
    updateParams((params) => {
      ["certificate", "badge", "minPrice", "maxPrice", "minArea", "maxArea"].forEach(
        (key) => params.delete(key),
      );
    });
  }

  return (
    <details className="group rounded-xl border border-border-subtle bg-surface-container-lowest lg:open:block" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-headline-sm font-headline-sm text-on-surface lg:pointer-events-none">
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
          Filter Pencarian
        </span>
        <ChevronDown className="h-5 w-5 text-outline transition-transform group-open:rotate-180 lg:hidden" aria-hidden="true" />
      </summary>

      <form onSubmit={applyRanges} className="border-t border-border-subtle p-5 pt-4">
        <fieldset className="mb-6">
          <legend className="mb-3 text-label-md font-label-md text-on-surface">Sertifikat</legend>
          <div className="space-y-2">
            {CERTIFICATES.map((certificate) => (
              <label key={certificate} className="flex cursor-pointer items-center gap-3 text-body-md text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={certificates.includes(certificate)}
                  onChange={() => toggleMultiValue("certificate", certificate)}
                  className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
                />
                {certificate}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 text-label-md font-label-md text-on-surface">Tipe Listing</legend>
          <div className="space-y-2">
            {BADGES.map((badge) => (
              <label key={badge.value} className="flex cursor-pointer items-center gap-3 text-body-md text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={badges.includes(badge.value)}
                  onChange={() => toggleMultiValue("badge", badge.value)}
                  className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
                />
                {badge.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 text-label-md font-label-md text-on-surface">Harga (Rp)</legend>
          <div className="grid grid-cols-2 gap-2">
            <RangeInput id="min-price" label="Minimum harga" value={priceMin} onChange={setPriceMin} placeholder="Min." />
            <RangeInput id="max-price" label="Maksimum harga" value={priceMax} onChange={setPriceMax} placeholder="Maks." />
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 text-label-md font-label-md text-on-surface">Luas Tanah (m²)</legend>
          <div className="grid grid-cols-2 gap-2">
            <RangeInput id="min-area" label="Minimum luas" value={areaMin} onChange={setAreaMin} placeholder="Min." />
            <RangeInput id="max-area" label="Maksimum luas" value={areaMax} onChange={setAreaMax} placeholder="Maks." />
          </div>
        </fieldset>

        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-label-md font-label-md text-on-primary hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Terapkan
          </button>
          <button type="button" onClick={resetFilters} className="inline-flex items-center justify-center rounded-lg border border-primary px-3 py-2.5 text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Reset semua filter">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </details>
  );
}

function RangeInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min="0"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
