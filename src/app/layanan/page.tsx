import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, Scale, ShieldCheck } from "lucide-react";
import { ServiceCatalog } from "@/presentation/components/services/ServiceCatalog";
import { ServiceFaq } from "@/presentation/components/services/ServiceFaq";
import { ServiceGuidance } from "@/presentation/components/services/ServiceGuidance";
import { ServicesHero } from "@/presentation/components/services/ServicesHero";
import { ServiceInquiryForm } from "@/presentation/components/services/ServiceInquiryForm";

export const metadata: Metadata = {
  title: "Layanan Kurata | Kurata",
  description: "Temukan layanan Kurata untuk pencarian tanah, pemasaran properti, koneksi broker, dan pendampingan informasi awal.",
  openGraph: {
    title: "Layanan Kurata | Kurata",
    description: "Dukungan informasi dan proses awal properti tanah bersama Kurata.",
  },
};

const BOUNDARIES = [
  { Icon: FileCheck2, title: "Informasi awal, bukan jaminan akhir", description: "Informasi yang dikurasi membantu Anda menentukan pertanyaan dan langkah berikutnya; verifikasi akhir tetap diperlukan." },
  { Icon: Scale, title: "Bukan pengganti profesi berwenang", description: "Notaris/PPAT, surveyor, penasihat hukum, dan penilai berlisensi menangani pekerjaan profesional sesuai kewenangannya." },
  { Icon: ShieldCheck, title: "Data seperlunya", description: "Untuk konsultasi awal, cukup kirim konteks umum. Jangan mengunggah atau mengirim dokumen identitas maupun kepemilikan sensitif." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesHero />
      <ServiceCatalog />
      <ServiceGuidance />

      <section className="bg-surface-container-low py-16 md:py-20" aria-labelledby="service-boundaries-title">
        <div className="container-main">
          <div className="max-w-2xl"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Cara kami bekerja</p><h2 id="service-boundaries-title" className="mt-2 text-3xl font-bold text-on-surface">Dukungan yang Jelas, Keputusan yang Terinformasi</h2><p className="mt-4 text-body-md leading-7 text-on-surface-variant">Kurata membantu merapikan kebutuhan dan informasi awal properti. Untuk menjaga proses tetap bertanggung jawab, kami menjelaskan batas setiap layanan sejak awal.</p></div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {BOUNDARIES.map(({ Icon, title, description }) => <article key={title} className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6"><Icon className="h-8 w-8 text-primary" aria-hidden="true" /><h3 className="mt-5 text-headline-sm font-headline-sm text-on-surface">{title}</h3><p className="mt-2 text-body-md leading-6 text-on-surface-variant">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="konsultasi" className="container-main scroll-mt-24 py-16 md:py-20" aria-labelledby="service-inquiry-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Konsultasi awal</p><h2 id="service-inquiry-title" className="mt-2 text-3xl font-bold text-on-surface">Mari Mulai dari Kebutuhan Anda</h2><p className="mt-4 text-body-md leading-7 text-on-surface-variant">Sampaikan gambaran umum properti atau tujuan Anda. Kami akan meninjau konteksnya dan mengarahkan layanan yang sesuai.</p><div className="mt-7 rounded-xl bg-primary p-6 text-on-primary"><BadgeCheck className="h-8 w-8 text-on-primary-container" aria-hidden="true" /><h3 className="mt-4 text-headline-sm font-headline-sm">Mulai dengan informasi yang aman</h3><p className="mt-2 text-body-md leading-6 text-on-primary/80">Tidak perlu mengirim dokumen formal di tahap ini. Apabila dibutuhkan, langkah lanjutan akan dibicarakan melalui kanal yang tepat.</p></div></div>
          <ServiceInquiryForm />
        </div>
      </section>

      <ServiceFaq />
    </div>
  );
}
