import { FileText, MapPin, Ruler, Route, ShieldCheck, Tag } from "lucide-react";
import type { PropertyDetailDTO } from "@/application/dto/PropertyDetailDTO";

export function PropertyFacts({ property }: { property: PropertyDetailDTO }) {
  const facts = [
    { icon: Ruler, label: "Luas tanah", value: property.area },
    { icon: FileText, label: "Sertifikat", value: property.certificate },
    { icon: Tag, label: "Peruntukan", value: property.zoning },
    { icon: Route, label: "Akses jalan", value: property.roadAccess },
    { icon: ShieldCheck, label: "Status legal", value: property.legalStatus },
    { icon: MapPin, label: "Dimensi", value: property.dimensions },
  ];

  return (
    <section aria-labelledby="property-facts-title" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
      <h2 id="property-facts-title" className="mb-6 text-headline-md font-headline-md text-on-surface">Informasi Properti</h2>
      <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div key={fact.label} className="flex gap-3 rounded-lg bg-surface-container-low p-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="text-label-sm text-on-surface-variant">{fact.label}</dt>
                <dd className="mt-1 text-body-md text-on-surface">{fact.value}</dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
