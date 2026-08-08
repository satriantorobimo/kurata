import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  Building,
  Building2,
  Car,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  Fuel,
  Headphones,
  Home,
  Landmark,
  LocateFixed,
  MapPin,
  MessageCircle,
  MoveHorizontal,
  Navigation,
  Ruler,
  Search,
  Sprout,
  Star,
  Store,
  TrendingUp,
  TreePalm,
  Truck,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Potensi Lahan | Kurata",
  description: "Analisis potensi lahan terbaik di setiap bidang tanah — aksesibilitas, lalu lintas, dan peluang bisnis dalam satu halaman bersama Kurata.",
  openGraph: { title: "Potensi Lahan | Kurata", description: "Temukan potensi terbaik di setiap bidang lahan bersama Kurata." },
};

const CATEGORIES = [
  { Icon: Factory, label: "Industri" },
  { Icon: Fuel, label: "SPBU" },
  { Icon: Warehouse, label: "Gudang" },
  { Icon: Building2, label: "Perkantoran" },
  { Icon: Store, label: "Ruko" },
  { Icon: Building, label: "Hotel" },
  { Icon: UtensilsCrossed, label: "Restoran" },
  { Icon: Sprout, label: "Pertanian" },
  { Icon: Home, label: "Perumahan" },
  { Icon: TreePalm, label: "Lahan Kosong" },
];

const POTENTIAL_LISTINGS = [
  { title: "Lahan Strategis Cikarang", location: "Cikarang, Jawa Barat", area: "4.500 m²", price: "Rp 2.300.000", imageUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&h=600&fit=crop" },
  { title: "Tanah Dekat Tol Cibitung", location: "Cibitung, Jawa Barat", area: "2.800 m²", price: "Rp 1.850.000", imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop" },
  { title: "Lahan Pesisir Sidoarjo", location: "Sidoarjo, Jawa Timur", area: "6.200 m²", price: "Rp 3.100.000", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop" },
  { title: "Kavling Komersial Palembang", location: "Palembang, Sumatera Selatan", area: "1.900 m²", price: "Rp 1.400.000", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
  { title: "Tanah Corridor Sukabumi", location: "Sukabumi, Jawa Barat", area: "3.400 m²", price: "Rp 1.950.000", imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop" },
];

const FEATURES = [
  { Icon: ArrowLeftRight, label: "Gerbang Tol" },
  { Icon: MoveHorizontal, label: "Jalan Lebar" },
  { Icon: Truck, label: "Truk Besar" },
  { Icon: Factory, label: "Dekat Kawasan Industri" },
  { Icon: Car, label: "Lalu Lintas Padat" },
];

const BUSINESS_OPPORTUNITIES = [
  "Volume kendaraan tinggi 24 jam",
  "Kebutuhan bahan bakar terus tumbuh",
  "Ekspansi kawasan industri sekitar",
  "Potensi pendapatan sewa lahan",
];

const AREA_ANALYSIS = [
  { label: "Aksesibilitas", rating: 5 },
  { label: "Potensi lalu lintas", rating: 5 },
  { label: "Pertumbuhan area", rating: 4 },
  { label: "Daya beli sekitar", rating: 4 },
];

const INFRASTRUCTURE = [
  { label: "Gerbang tol terdekat", distance: "1,2 km" },
  { label: "Terminal angkutan", distance: "2,8 km" },
  { label: "Kawasan industri", distance: "2,1 km" },
  { label: "Rumah sakit", distance: "5,6 km" },
  { label: "Pusat kota", distance: "8,4 km" },
];

const SIMILAR_LISTINGS = [
  { title: "Lahan Jl. Raya Serang", location: "Serang, Banten", price: "Rp 1.650.000", imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop" },
  { title: "Kavling Semarang Barat", location: "Semarang, Jawa Tengah", price: "Rp 1.250.000", imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop" },
  { title: "Tanah Akses Tol Kertosono", location: "Kertosono, Jawa Timur", price: "Rp 2.100.000", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" },
  { title: "Lahan Medan Marelan", location: "Medan, Sumatera Utara", price: "Rp 1.150.000", imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop" },
];

const SCORE_METRICS = [
  { label: "Aksesibilitas", score: 4.9 },
  { label: "Lokasi strategis", score: 4.7 },
  { label: "Potensi bisnis", score: 4.8 },
  { label: "Infrastruktur", score: 4.6 },
  { label: "Legalitas", score: 5.0 },
];

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <div>
      <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-balance text-xl font-bold leading-snug tracking-tight text-on-surface sm:text-2xl">{title}</h2>
    </div>
  );
}

function StarRating({ rating, size = "h-5 w-5" }: { rating: number; size?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Skor ${rating} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn(size, i <= rating ? "fill-amber-400 text-amber-400" : "text-outline-variant")} aria-hidden="true" />
      ))}
    </span>
  );
}

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-100 w-full items-center overflow-hidden bg-surface-container-lowest pt-16 md:min-h-150 md:pt-20">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/kurata_bg.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface/75 via-on-surface/40 to-on-surface/10" />
        </div>
        <div className="container-main relative z-10 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-label-sm font-label-sm text-white backdrop-blur">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Potensi Lahan
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl">
              Temukan Potensi Terbaik di Setiap Bidang Lahan
            </h1>
            <p className="mt-5 max-w-xl text-body-md leading-7 text-white/80">
              Kurata membantu Anda menganalisis lokasi, aksesibilitas, dan peluang bisnis di sekitar lahan untuk menemukan investasi yang paling tepat.
            </p>
            <form className="mt-8 flex w-full max-w-3xl flex-col gap-2 rounded-2xl bg-surface-container-lowest p-2 shadow-search sm:flex-row sm:items-center sm:rounded-full">
              <label className="flex flex-1 items-center gap-2 px-3 py-2.5 sm:px-4">
                <Search className="h-5 w-5 shrink-0 text-on-surface-variant" aria-hidden="true" />
                <input type="text" placeholder="Cari lokasi..." className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant" />
              </label>
              <span className="hidden h-6 w-px bg-border-subtle sm:block" aria-hidden="true" />
              <label className="flex flex-1 items-center gap-2 border-t border-border-subtle px-3 py-2.5 sm:border-t-0 sm:px-4">
                <LocateFixed className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <input type="text" placeholder="Lokasi Saya" defaultValue="Bandung, Jawa Barat" className="w-full bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant" />
              </label>
              <button type="submit" className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
                Cari Potensi
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <main className="container-main pb-16 pt-8 md:pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-8">
            <section aria-labelledby="kategori-title">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <SectionHeading eyebrow="Kategori" title="Jelajahi Berdasarkan Potensi" id="kategori-title" />
                <Link href="/cari-tanah" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
                  Lihat Semua Kategori
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {CATEGORIES.map(({ Icon, label }) => (
                  <Link key={label} href="/cari-tanah" className="group flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-surface-container-lowest px-4 py-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 break-words text-[13px] font-label-sm leading-5 text-on-surface">{label}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section aria-labelledby="listing-title">
              <SectionHeading eyebrow="Rekomendasi untuk Anda" title="Lahan Potensial untuk SPBU" id="listing-title" />
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x">
                {POTENTIAL_LISTINGS.map((listing) => (
                  <article key={listing.title} className="group w-72 shrink-0 snap-start overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-card transition-shadow hover:shadow-card-hover">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${listing.imageUrl}')` }} role="img" aria-label={listing.title} />
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-label-sm font-label-sm text-on-primary shadow-sm">Potensi Tinggi</span>
                    </div>
                    <div className="p-4">
                      <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">{listing.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-label-sm text-on-surface-variant">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {listing.location}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-label-sm text-on-surface-variant">
                        <Ruler className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {listing.area}
                      </p>
                      <p className="mt-2 font-headline-sm text-headline-sm text-primary">{listing.price} <span className="font-body-md text-on-surface-variant">/ m²</span></p>
                      <Link href="/cari-tanah" className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
                        Lihat Detail
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="features-title" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
              <SectionHeading eyebrow="Alasan utama" title="Kenapa Lahan Ini Berpotensi?" id="features-title" />
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
                {FEATURES.map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-3 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="text-label-md font-label-md leading-5 text-on-surface">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
                <h3 className="flex items-center gap-2 text-base font-semibold text-on-surface">
                  <CircleDollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                  Peluang Bisnis
                </h3>
                <ul className="mt-4 space-y-3">
                  {BUSINESS_OPPORTUNITIES.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-body-md leading-6 text-on-surface-variant">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
                <h3 className="flex items-center gap-2 text-base font-semibold text-on-surface">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                  Analisis Wilayah
                </h3>
                <ul className="mt-4 space-y-4">
                  {AREA_ANALYSIS.map(({ label, rating }) => (
                    <li key={label} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <span className="text-body-md text-on-surface-variant">{label}</span>
                      <StarRating rating={rating} />
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
                <h3 className="flex items-center gap-2 text-base font-semibold text-on-surface">
                  <Landmark className="h-5 w-5 text-primary" aria-hidden="true" />
                  Infrastruktur Sekitar
                </h3>
                <ul className="mt-4 space-y-3">
                  {INFRASTRUCTURE.map(({ label, distance }) => (
                    <li key={label} className="flex items-center justify-between gap-3 text-body-md">
                      <span className="text-on-surface-variant">{label}</span>
                      <span className="flex shrink-0 items-center gap-1 font-label-md text-on-surface">
                        <Navigation className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {distance}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section aria-labelledby="insight-title" className="relative overflow-hidden rounded-xl bg-surface-container-low p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
                <div>
                  <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Insight Kurata</p>
                  <h2 id="insight-title" className="mt-2 text-balance text-xl font-bold leading-snug tracking-tight text-on-surface sm:text-2xl">
                    Peluang Tinggi di Koridor Tol Jakarta–Cikampek
                  </h2>
                  <p className="mt-3 text-body-md leading-7 text-on-surface-variant">
                    Berdasarkan analisis kami, lahan di koridor ini dilintasi hingga 120.000 kendaraan per hari, ditunjang akses tol ganda dan pertumbuhan kawasan industri. Kombinasi ini menjadikannya lokasi ideal untuk pembangunan SPBU.
                  </p>
                </div>
                <div className="relative hidden h-56 lg:block" aria-hidden="true">
                  <div className="absolute inset-0 flex items-end justify-center rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
                    <div className="relative w-full px-6 pb-6">
                      <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-xl bg-primary shadow-card-hover">
                        <div className="absolute inset-x-4 top-4 h-2 rounded-full bg-white/25" />
                        <Fuel className="h-14 w-14 text-on-primary" />
                        <div className="absolute -inset-3 -z-10 rounded-full bg-primary/20 blur-xl" />
                      </div>
                      <div className="mx-auto mt-4 h-2 w-28 rounded-full bg-primary/15 blur-[1px]" />
                      <MapPin className="absolute -top-2 left-1/2 h-9 w-9 -translate-x-1/2 fill-primary text-white drop-shadow-md" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="similar-title">
              <div className="flex items-center justify-between gap-4">
                <SectionHeading eyebrow="Pilihan lainnya" title="Lahan Serupa" id="similar-title" />
                <Link href="/cari-tanah" className="hidden shrink-0 items-center gap-1 text-label-md font-label-md text-primary hover:underline sm:inline-flex">
                  Lihat semua
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x">
                {SIMILAR_LISTINGS.map(({ title, location, price, imageUrl }) => (
                  <Link key={title} href="/cari-tanah" className="group w-56 shrink-0 snap-start overflow-hidden rounded-xl border border-border-subtle bg-surface-container-lowest shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <div className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${imageUrl}')` }} role="img" aria-label={title} />
                    </div>
                    <div className="p-4">
                      <h3 className="truncate text-label-md font-label-md text-on-surface">{title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-label-sm text-on-surface-variant">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {location}
                      </p>
                      <p className="mt-2 font-headline-sm text-headline-sm text-primary">{price} <span className="font-body-md text-on-surface-variant">/ m²</span></p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section aria-labelledby="score-title" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
              <h2 id="score-title" className="text-headline-md font-headline-md text-on-surface">Skor Potensi Lahan</h2>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-5xl font-bold tracking-tight text-on-surface">4.8</span>
                <span className="pb-1.5 text-label-md text-on-surface-variant">/ 5</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <ul className="mt-6 space-y-5">
                {SCORE_METRICS.map(({ label, score }) => (
                  <li key={label}>
                    <div className="flex items-center justify-between text-label-md font-label-md">
                      <span className="text-on-surface">{label}</span>
                      <span className="text-on-surface-variant">{score.toFixed(1)}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${score * 20}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
                Lihat Analisis Lengkap
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </section>

            <section aria-labelledby="partner-title" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
              <h2 id="partner-title" className="text-headline-md font-headline-md text-on-surface">Tanya Mitra Kurata</h2>
              <div className="mt-5 flex items-center gap-4">
                <Image src="/broker.png" alt="Foto Rizky Pratama" width={64} height={64} className="h-16 w-16 rounded-full border border-border-subtle object-cover" />
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">Rizky Pratama</p>
                  <p className="text-label-sm text-on-surface-variant">Mitra Kurata · Jakarta</p>
                  <p className="mt-1 flex items-center gap-1 text-label-md font-label-md text-on-surface">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    5.0
                    <span className="font-normal text-on-surface-variant">(128 ulasan)</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Hubungi via WhatsApp
                </button>
                <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 text-label-md font-label-md text-primary transition-colors hover:bg-primary/5">
                  Jadwalkan Survey
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <section aria-labelledby="footer-cta-title" className="bg-primary py-16 md:py-20">
        <div className="container-main flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-on-primary/10 text-on-primary">
              <Headphones className="h-8 w-8" aria-hidden="true" />
            </span>
            <div>
              <h2 id="footer-cta-title" className="text-xl font-bold leading-snug tracking-tight text-on-primary sm:text-2xl md:text-3xl">
                Tidak menemukan lahan yang sesuai?
              </h2>
              <p className="mt-2 text-body-md leading-7 text-on-primary/80">
                Tim Kurata siap membantu Anda mencari lahan potensial sesuai kebutuhan bisnis dan anggaran.
              </p>
            </div>
          </div>
          <Link href="/bantuan" className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-on-primary/40 px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-on-primary/10">
            Konsultasi Sekarang
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
