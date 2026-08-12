/* eslint-disable @next/next/no-img-element */
"use client";

import { Heart, MapPin, Ruler, FileText, MessageCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/presentation/components/shared/Badge";
import type { PropertyDTO } from "@/application/dto/PropertyDTO";

interface SalesInfo {
  name: string;
  phone: string;
  avatarUrl: string | null;
}

interface PropertyCardProps {
  property: PropertyDTO;
  salesInfo?: SalesInfo | null;
}

export function PropertyCard({ property, salesInfo }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(property.isFavorited);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group border border-border-subtle/50">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
        <Link href={`/cari-tanah/${property.id}`} aria-label={`Lihat detail ${property.title}`} className="absolute inset-0">
          <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${property.imageUrl}')` }} role="img" aria-label={property.title} />
        </Link>

        {/* Badge */}
        {property.badge && (
          <div className="pointer-events-none absolute left-4 top-4 z-10">
            <Badge variant={property.badge} />
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={cn(
            "absolute right-4 top-4 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors",
            "bg-surface-container-lowest/80 backdrop-blur",
            isFavorited ? "text-error" : "text-on-surface hover:text-error",
          )}
          aria-label={isFavorited ? "Hapus dari favorit" : "Simpan ke favorit"}
        >
          <Heart className="w-[18px] h-[18px]" fill={isFavorited ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content: 2-column layout */}
      <div className="flex">
        {/* Left: Property info */}
        <Link
          href={`/cari-tanah/${property.id}`}
          className="flex-1 min-w-0 p-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
        >
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-label-sm text-on-surface-variant mb-2">
            <MapPin className="w-[14px] h-[14px] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          <div className="flex items-center gap-3 text-label-sm text-on-surface-variant mb-2">
            <div className="flex items-center gap-1">
              <FileText className="w-[14px] h-[14px]" />
              {property.certificate}
            </div>
            <span className="text-outline">·</span>
            <div className="flex items-center gap-1">
              <Ruler className="w-[14px] h-[14px]" />
              {property.area}
            </div>
          </div>
          <div className="font-headline-sm text-headline-sm text-primary">
            {property.price}
          </div>
        </Link>

        {/* Right: Sales contact */}
        {property.badge === "exclusive" && salesInfo ? (
          <div className="w-36 shrink-0 border-l border-border-subtle bg-surface-container-lowest px-4 py-5 flex flex-col items-center justify-center text-center gap-2">
            {salesInfo.avatarUrl ? (
              <img src={salesInfo.avatarUrl} alt={`Foto ${salesInfo.name}`} className="h-10 w-10 rounded-full border border-border-subtle object-cover" />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label-sm font-bold text-primary">{salesInfo.name.slice(0, 1).toUpperCase()}</div>
            )}
            <div className="min-w-0">
              <p className="text-label-sm text-on-surface-variant leading-tight">Hubungi:</p>
              <p className="truncate text-label-sm font-medium text-on-surface leading-tight">{salesInfo.name}</p>
            </div>
            {salesInfo.phone ? (
              <a
                href={`https://wa.me/${salesInfo.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-medium text-on-primary transition-colors hover:bg-primary/90"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat WA
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
