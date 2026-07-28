import { SearchX } from "lucide-react";
import { PropertyCard } from "@/presentation/components/home/PropertyCard";
import type { PropertyDTO } from "@/application/dto/PropertyDTO";

interface SearchResultsProps {
  properties: PropertyDTO[];
}

export function SearchResults({ properties }: SearchResultsProps) {
  if (properties.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
        <SearchX className="mb-4 h-10 w-10 text-primary" aria-hidden="true" />
        <h2 className="mb-2 text-headline-sm font-headline-sm text-on-surface">Belum ada tanah yang sesuai</h2>
        <p className="max-w-md text-body-md text-on-surface-variant">Coba perluas lokasi pencarian atau kurangi beberapa filter yang dipilih.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
    </div>
  );
}
