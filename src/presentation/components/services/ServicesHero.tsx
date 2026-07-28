import Image from "next/image";
import Link from "next/link";
import { ArrowDown, CheckCircle2, Compass } from "lucide-react";

const HIGHLIGHTS = ["Kebutuhan lebih terpetakan", "Langkah awal lebih jelas", "Dukungan sesuai konteks"];

export function ServicesHero() {
  return (
    <section className="overflow-hidden bg-surface-container-low pt-16 md:pt-20">
      <div className="container-main grid items-center gap-12 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-label-sm font-label-sm text-primary"><Compass className="h-4 w-4" aria-hidden="true" />Layanan Kurata</div>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-on-surface md:text-5xl">Mulai Urusan Tanah Anda dengan Arah yang Jelas</h1>
          <p className="mt-5 max-w-xl text-body-md leading-7 text-on-surface-variant md:text-base">Dari mencari tanah hingga menyiapkan proses selanjutnya, Kurata membantu Anda memahami kebutuhan dan menentukan langkah awal yang relevan.</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {HIGHLIGHTS.map((highlight) => <li key={highlight} className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{highlight}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#konsultasi" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Konsultasi Kebutuhan<ArrowDown className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="#layanan" className="inline-flex items-center justify-center rounded-lg border border-primary px-6 py-3 text-label-md font-label-md text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Eksplor Layanan</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="absolute -inset-6 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl bg-primary shadow-card">
            <Image src="/eksklusif.png" alt="Ilustrasi layanan pertanahan Kurata" width={1182} height={1182} priority className="aspect-square w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary via-primary/70 to-transparent px-6 pb-6 pt-20 text-on-primary">
              <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-primary-container">Pendampingan awal</p>
              <p className="mt-2 text-headline-sm font-headline-sm">Pahami pilihan Anda sebelum melangkah lebih jauh.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
