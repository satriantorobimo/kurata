import { PropertyCard } from "@/presentation/components/home/PropertyCard";
import type { PropertyDTO } from "@/application/dto/PropertyDTO";

export function RelatedProperties({ properties, hrefForProperty }: { properties: PropertyDTO[]; hrefForProperty?: (property: PropertyDTO) => string }) {
  if (properties.length === 0) return null;

  return (
    <section className="border-t border-border-subtle pt-12" aria-labelledby="related-properties-title">
      <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">Pilihan lainnya</p>
      <h2 id="related-properties-title" className="mb-7 text-headline-md font-headline-md text-on-surface">Properti Serupa</h2>
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => <PropertyCard key={property.id} property={property} href={hrefForProperty?.(property)} />)}
      </div>
    </section>
  );
}
