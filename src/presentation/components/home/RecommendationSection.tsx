import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyDTO } from "@/application/dto/PropertyDTO";

interface RecommendationSectionProps {
  properties: PropertyDTO[];
  salesMap: Map<string, { name: string; phone: string; avatarUrl: string | null }>;
}

export function RecommendationSection({ properties, salesMap }: RecommendationSectionProps) {
  return (
    <section className="w-full container-main mb-section-gap">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
            Rekomendasi Tanah Terbaik
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Pilihan tanah berkualitas dari seluruh Indonesia
          </p>
        </div>
        <Link
          href="/cari-tanah"
          className="text-label-md font-label-md text-primary flex items-center gap-1 hover:underline"
        >
          Lihat Semua <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} salesInfo={salesMap.get(property.id) ?? null} />
        ))}
      </div>
    </section>
  );
}
