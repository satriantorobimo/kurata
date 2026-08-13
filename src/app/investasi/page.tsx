import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Factory, Fuel, Home, LocateFixed, MapPin, Search, TreePalm, Warehouse, Building2, Store, Building, UtensilsCrossed, Sprout, Ruler } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { GetInvestasiContent } from "@/application/use-cases/GetInvestasiContent";
import { SearchProperties } from "@/application/use-cases/SearchProperties";
import { container } from "@/infrastructure/di/container";

export const metadata: Metadata = {
  title: "Potensi Lahan | Kurata",
  description: "Temukan lahan dengan potensi bisnis di seluruh Indonesia.",
  alternates: { canonical: "/investasi" },
};

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<string, LucideIcon> = { Factory, Fuel, Warehouse, Building2, Store, Building, UtensilsCrossed, Sprout, Home, TreePalm };

export default async function InvestmentPage() {
  const [content, listingResult] = await Promise.all([
    new GetInvestasiContent(container.contentSectionRepo).execute(),
    new SearchProperties(container.propertyRepo).execute({ landType: "business_potential", sort: "recommended", page: 1, perPage: 12 }),
  ]);

  return <div className="min-h-screen bg-background pt-16 md:pt-20">
    <section className="relative flex min-h-100 items-center overflow-hidden bg-surface-container-lowest py-14 md:min-h-150 md:py-20">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/kurata_bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-on-surface/75 via-on-surface/40 to-on-surface/10" />
      </div>
      <div className="container-main relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-label-sm font-label-sm text-white backdrop-blur"><MapPin className="h-4 w-4" />Potensi Lahan</div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">Temukan Lahan dengan Potensi Bisnis Terbaik</h1>
          <p className="mt-5 text-body-md leading-7 text-white/80">Jelajahi lahan pilihan yang telah dipisahkan khusus berdasarkan potensi bisnis, akses, dan peluang pengembangannya.</p>
          <div className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-border-subtle bg-surface-container-lowest p-3 shadow-card"><Search className="h-5 w-5 text-on-surface-variant" /><span className="flex-1 text-body-md text-on-surface-variant">Cari lokasi atau jenis potensi</span><LocateFixed className="h-5 w-5 text-primary" /></div>
        </div>
      </div>
    </section>

    <main className="container-main py-10 md:py-14">
      <section aria-labelledby="kategori-title">
        <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Kategori</p>
        <h2 id="kategori-title" className="mt-2 text-2xl font-bold text-on-surface">Jelajahi Berdasarkan Potensi</h2>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {content.categories.map(({ icon, label }) => {
            const Icon = CATEGORY_ICONS[icon] ?? Home;
            return <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-surface-container-lowest px-4 py-5 text-center shadow-card"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><span className="text-label-md font-label-md text-on-surface">{label}</span></div>;
          })}
        </div>
      </section>

      {listingResult.properties.length > 0 ? <section aria-labelledby="listing-title" className="mt-14">
        <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Pilihan Potensi Lahan</p>
        <h2 id="listing-title" className="mt-2 text-2xl font-bold text-on-surface">Lahan dengan Potensi Bisnis</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listingResult.properties.map((listing) => <article key={listing.id} className="group overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-card transition-shadow hover:shadow-card-hover"><div className="relative aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url('${listing.imageUrl}')` }} role="img" aria-label={listing.title}><span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-label-sm font-label-sm text-on-primary">Potensi Bisnis</span></div><div className="p-4"><h3 className="truncate text-headline-sm font-headline-sm text-on-surface">{listing.title}</h3><p className="mt-2 flex items-center gap-1 text-label-sm text-on-surface-variant"><MapPin className="h-3.5 w-3.5" />{listing.location}</p><p className="mt-2 flex items-center gap-1 text-label-sm text-on-surface-variant"><Ruler className="h-3.5 w-3.5" />{listing.area}</p><p className="mt-3 text-headline-sm font-headline-sm text-primary">{listing.price} <span className="font-body-md text-on-surface-variant">/ m²</span></p><Link href={`/investasi/${listing.id}`} className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary hover:bg-primary/90">Lihat Analisis <ArrowRight className="h-4 w-4" /></Link></div></article>)}
        </div>
      </section> : null}
    </main>
  </div>;
}
