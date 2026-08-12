/* eslint-disable @next/next/no-img-element */
"use client";

import { Heart, MapPin, Ruler, FileText, MessageCircle, CheckCircle2 } from "lucide-react";
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
    <div className="bg-surface-container-lowest rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group border border-border-subtle/50">
      {/* Image Section */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden bg-surface-container-low">
        <Link href={`/cari-tanah/${property.id}`} aria-label={`Lihat detail ${property.title}`} className="absolute inset-0">
          <div 
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
            style={{ backgroundImage: `url('${property.imageUrl}')` }} 
            role="img" 
            aria-label={property.title} 
          />
        </Link>

        {/* Top Left Badge */}
        {property.badge && (
          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <Badge variant={property.badge} />
          </div>
        )}

        {/* Top Right Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={cn(
            "absolute right-3 top-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-colors",
            "bg-white/95 backdrop-blur hover:bg-white",
            isFavorited ? "text-error" : "text-on-surface hover:text-error",
          )}
          aria-label={isFavorited ? "Hapus dari favorit" : "Simpan ke favorit"}
        >
          <Heart className="w-[18px] h-[18px]" fill={isFavorited ? "currentColor" : "none"} />
        </button>

        {/* Bottom Left Area Overlay (New) */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-[#144834]/95 px-3 py-1.5 text-white backdrop-blur shadow-sm">
          <Ruler className="w-4 h-4" />
          <span className="text-sm font-semibold">{property.area}</span>
        </div>
      </div>

      {/* Content Section: 2-Column Layout */}
      <div className="flex flex-col sm:flex-row p-4 gap-5">
        
        {/* Left: Property Info */}
        <Link
          href={`/cari-tanah/${property.id}`}
          className="flex-1 min-w-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-xl text-on-surface mb-2 uppercase leading-snug line-clamp-2">
              {property.title}
            </h3>
            
            <div className="flex items-start gap-1.5 text-sm text-on-surface-variant mb-4">
              <MapPin className="w-[16px] h-[16px] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{property.location}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant mb-4">
              <div className="flex items-center gap-1.5">
                <FileText className="w-[16px] h-[16px]" />
                <span className="font-medium">{property.certificate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-[16px] h-[16px]" />
                <span className="font-medium">Lokasi Strategis</span>
              </div>
            </div>
          </div>
          
          <div className="font-bold text-2xl text-on-surface mt-2">
            {property.price}
          </div>
        </Link>

        {/* Right: Agent Contact Card (Redesigned) */}
        {property.badge === "exclusive" && salesInfo ? (
          <div className="w-full sm:w-[220px] shrink-0 rounded-2xl bg-[#F0F5F2] p-3.5 flex flex-col justify-between gap-3 border border-[#E2ECE6]">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {salesInfo.avatarUrl ? (
                  <img src={salesInfo.avatarUrl} alt={`Foto ${salesInfo.name}`} className="h-[42px] w-[42px] shrink-0 rounded-full object-cover border-2 border-white shadow-sm" />
                ) : (
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#144834]/10 text-sm font-bold text-[#144834] border-2 border-white shadow-sm">
                    {salesInfo.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                {/* Verified Badge Icon */}
                <div className="absolute -bottom-1 -right-1 bg-[#144834] rounded-full p-[1px] border-[1.5px] border-white">
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
              
              <div className="flex flex-col min-w-0">
                <p className="text-[11px] text-on-surface-variant leading-tight mb-0.5">Hubungi:</p>
                <p className="truncate text-sm font-semibold text-on-surface leading-tight">{salesInfo.name}</p>
              </div>
            </div>
            
            {salesInfo.phone ? (
              <a
                href={`https://wa.me/${salesInfo.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#144834] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0e3325] shadow-sm"
              >
                <MessageCircle className="h-[15px] w-[15px]" />
                Chat via WhatsApp
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}