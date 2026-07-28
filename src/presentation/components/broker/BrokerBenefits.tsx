import { BadgeCheck, ChartNoAxesCombined, Handshake, ListChecks, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ChartNoAxesCombined, title: "Jangkauan Lebih Luas", description: "Tampilkan listing Anda kepada calon pembeli yang tepat melalui ekosistem Kurata." },
  { icon: BadgeCheck, title: "Listing Terarah", description: "Bangun portofolio yang lebih rapi dengan informasi listing yang mudah dipahami." },
  { icon: ShieldCheck, title: "Proses Transparan", description: "Utamakan data dan komunikasi yang jelas dalam setiap tahap pemasaran." },
  { icon: Users, title: "Jaringan Profesional", description: "Terhubung dengan sesama broker dan tim Kurata untuk peluang kolaborasi." },
  { icon: ListChecks, title: "Dukungan Operasional", description: "Gunakan panduan program untuk menjaga kualitas dan kelengkapan listing." },
  { icon: Handshake, title: "Kemitraan Bertumbuh", description: "Kembangkan layanan Anda bersama platform yang berfokus pada pertanahan." },
];

export function BrokerBenefits() {
  return (
    <section className="container-main py-16 md:py-20" aria-labelledby="broker-benefits-title">
      <div className="max-w-2xl">
        <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">Mengapa bergabung</p>
        <h2 id="broker-benefits-title" className="text-3xl font-bold text-on-surface">Dukungan untuk Broker yang Serius Bertumbuh</h2>
        <p className="mt-3 text-body-md leading-7 text-on-surface-variant">Kurata dirancang untuk membantu broker membangun proses pemasaran tanah yang lebih profesional dan mudah dipercaya.</p>
      </div>
      <div className="mt-10 grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article key={benefit.title} className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface">{benefit.title}</h3>
              <p className="mt-2 text-body-md leading-6 text-on-surface-variant">{benefit.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
