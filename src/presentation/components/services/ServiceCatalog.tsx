import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, FileSearch, Handshake, ListFilter, Megaphone, SearchCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SERVICE_CATALOG } from "@/application/config/serviceCatalog";

const ICONS: Record<(typeof SERVICE_CATALOG)[number]["id"], LucideIcon> = {
  "property-search": SearchCheck,
  "initial-information-review": FileSearch,
  "indicative-price-estimate": ChartNoAxesCombined,
  "property-marketing": Megaphone,
  "broker-connection": Handshake,
  "transaction-guidance": ListFilter,
};

export function ServiceCatalog() {
  return (
    <section id="layanan" className="container-main scroll-mt-24 py-16 md:py-24" aria-labelledby="service-catalog-title">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Pilihan layanan</p><h2 id="service-catalog-title" className="mt-2 text-3xl font-bold tracking-tight text-on-surface">Dukungan untuk Setiap Titik Awal</h2><p className="mt-3 text-body-md leading-7 text-on-surface-variant">Pilih kebutuhan yang paling mendekati situasi Anda. Kami bantu memetakan langkah berikutnya.</p></div><Link href="#konsultasi" className="inline-flex items-center gap-1 text-label-md font-label-md text-primary hover:underline">Belum yakin memilih? Konsultasikan<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICE_CATALOG.map((service, index) => {
          const Icon = ICONS[service.id];
          return <article key={service.id} className="group flex min-h-72 flex-col rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div><span className="text-label-sm font-label-sm text-outline">0{index + 1}</span></div><p className="mt-6 text-label-sm font-label-sm text-primary">Untuk {service.audience}</p><h3 className="mt-2 text-headline-sm font-headline-sm text-on-surface">{service.title}</h3><p className="mt-2 text-body-md leading-6 text-on-surface-variant">{service.description}</p>{service.disclaimer && <p className="mt-4 border-l-2 border-primary/35 pl-3 text-label-sm leading-5 text-on-surface-variant">{service.disclaimer}</p>}<Link href="#konsultasi" className="mt-auto pt-6 inline-flex items-center gap-1 text-label-md font-label-md text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Pelajari kebutuhan Anda<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link></article>;
        })}
      </div>
    </section>
  );
}
