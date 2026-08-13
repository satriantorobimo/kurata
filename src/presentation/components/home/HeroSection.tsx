"use client";

import { FormEvent, useState } from "react";
import { Search, ChevronDown, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

interface FilterChip {
  id: string;
  label: string;
  icon?: "lock" | "chevron";
  param?: "certificate" | "badge";
  value?: string;
}

const FILTER_CHIPS: FilterChip[] = [
  { id: "shm", label: "SHM", icon: "lock", param: "certificate", value: "SHM" },
  { id: "hgb", label: "HGB", param: "certificate", value: "HGB" },
  { id: "luas-tanah", label: "Luas Tanah", icon: "chevron" },
  { id: "harga", label: "Harga", icon: "chevron" },
  { id: "peruntukan", label: "Peruntukan", icon: "chevron" },
  { id: "broker", label: "Mitra Kurata", param: "badge", value: "broker" },
  { id: "exclusive", label: "Exclusive Kurata", param: "badge", value: "exclusive" },
];

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const normalizedQuery = searchQuery.trim();
    if (normalizedQuery) params.set("q", normalizedQuery);

    FILTER_CHIPS.filter((chip) => activeFilters.includes(chip.id) && chip.param && chip.value)
      .forEach((chip) => params.append(chip.param!, chip.value!));

    const suffix = params.toString();
    router.push(`/cari-tanah${suffix ? `?${suffix}` : ""}`);
  }

  return (
    <section className="relative flex min-h-100 w-full items-center overflow-hidden bg-surface-container-lowest md:min-h-150">
      {/* Background Image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/kurata_bg.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-on-surface/75 via-on-surface/40 to-on-surface/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full container-main py-12 md:py-16 flex flex-col items-center text-center px-4 md:px-margin">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white mb-3 md:mb-4 max-w-3xl">
          Ekosistem Pertanahan Terpercaya
        </h1>
        <p className="text-sm md:text-headline-sm text-white/80 mb-8 md:mb-12 max-w-2xl">
          Semua kebutuhan pertanahan, dari pencarian hingga transaksi, dalam
          satu platform digital yang aman, transparan, dan profesional.
        </p>

        {/* Search Pill */}
        <form onSubmit={handleSearch} className="w-full max-w-4xl bg-surface-container-lowest rounded-full p-2 shadow-search flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
          <Search className="w-5 h-5 text-outline ml-2 md:ml-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Kota / Kabupaten / Provinsi"
            aria-label="Cari kota, kabupaten, atau provinsi"
            className="flex-1 bg-transparent border-none focus:outline-none text-body-md text-on-surface placeholder-outline-variant"
          />
          <button type="submit" className="bg-primary hover:bg-primary/90 text-on-primary px-4 md:px-8 py-2.5 md:py-3 rounded-full font-label-md transition-colors flex items-center gap-1 md:gap-2 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <Search className="w-[18px] h-[18px]" />
            <span className="hidden sm:inline">Cari Tanah</span>
            <span className="sm:hidden">Cari</span>
          </button>
        </form>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => toggleFilter(chip.id)}
              aria-pressed={activeFilters.includes(chip.id)}
              className={cn(
                "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-label-sm font-label-sm flex items-center gap-1 md:gap-2 transition-colors border",
                activeFilters.includes(chip.id)
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container-lowest border-border-subtle text-on-surface-variant hover:border-primary",
              )}
            >
              {chip.icon === "lock" && <Lock className="w-4 h-4" />}
              {chip.label}
              {chip.icon === "chevron" && <ChevronDown className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
