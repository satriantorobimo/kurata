"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  initialQuery: string;
}

export function SearchBar({ initialQuery }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const normalizedQuery = query.trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    params.delete("page");
    const suffix = params.toString();
    router.push(`/cari-tanah${suffix ? `?${suffix}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="property-search" className="sr-only">
        Cari tanah berdasarkan lokasi atau kata kunci
      </label>
      <div className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-2 shadow-search border border-border-subtle">
        <Search className="ml-2 h-5 w-5 shrink-0 text-outline" aria-hidden="true" />
        <input
          id="property-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari kota, kabupaten, atau kata kunci"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-body-md text-on-surface outline-none placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:px-6"
        >
          <Search className="h-[18px] w-[18px]" aria-hidden="true" />
          <span className="hidden sm:inline">Cari Tanah</span>
          <span className="sm:hidden">Cari</span>
        </button>
      </div>
    </form>
  );
}
