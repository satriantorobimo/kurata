"use client";

import { Search, X } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = "Cari..." }: SearchFieldProps) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border-subtle bg-surface-container-lowest py-2.5 pl-10 pr-9 text-body-md outline-none transition focus:border-primary sm:w-64"
      />
      {value ? (
        <button type="button" onClick={() => onChange("")} aria-label="Bersihkan pencarian" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface">
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </label>
  );
}