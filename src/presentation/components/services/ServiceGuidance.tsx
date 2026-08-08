import { Building2, CheckCircle2, ClipboardList, MessageSquareText, Route, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const AUDIENCES: { icon: LucideIcon; title: string; description: string; items: string[] }[] = [
  { icon: Building2, title: "Pemilik Tanah", description: "Siapkan pemasaran, informasi listing, dan kebutuhan pendampingan awal.", items: ["Pemasaran properti", "Estimasi indikatif", "Koneksi broker"] },
  { icon: UsersRound, title: "Pembeli & Investor", description: "Pahami pilihan tanah dan persiapan yang dibutuhkan sebelum mengambil keputusan.", items: ["Pencarian tanah", "Pemeriksaan informasi", "Panduan transaksi"] },
  { icon: MessageSquareText, title: "Mitra Kurata", description: "Petakan kebutuhan klien dan buka peluang kolaborasi yang relevan.", items: ["Koneksi mitra", "Informasi listing", "Panduan proses"] },
];

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: MessageSquareText, title: "Ceritakan kebutuhan", description: "Bagikan tujuan, area, dan konteks singkat Anda." },
  { icon: ClipboardList, title: "Tinjauan awal", description: "Informasi awal ditinjau untuk melihat kebutuhan utamanya." },
  { icon: Route, title: "Arahkan langkah", description: "Anda mendapat arahan layanan atau kebutuhan profesional yang relevan." },
  { icon: CheckCircle2, title: "Lanjutkan proses", description: "Teruskan dengan layanan Kurata atau profesional yang tepat." },
];

export function ServiceGuidance() {
  return <><section className="bg-primary py-16 text-on-primary md:py-20" aria-labelledby="service-audience-title"><div className="container-main"><div className="max-w-2xl"><p className="text-label-sm font-label-sm uppercase tracking-wider text-on-primary-container">Untuk siapa</p><h2 id="service-audience-title" className="mt-2 text-3xl font-bold tracking-tight">Mulai dari Situasi Anda</h2><p className="mt-3 text-body-md leading-7 text-on-primary/75">Setiap peran memiliki titik awal yang berbeda. Pilih jalur yang paling dekat dengan kebutuhan Anda saat ini.</p></div><div className="mt-9 grid gap-4 md:grid-cols-3">{AUDIENCES.map((audience) => { const Icon = audience.icon; return <article key={audience.title} className="rounded-2xl border border-on-primary/15 bg-on-primary/8 p-6"><Icon className="h-7 w-7 text-on-primary-container" aria-hidden="true" /><h3 className="mt-5 text-headline-sm font-headline-sm">{audience.title}</h3><p className="mt-2 text-body-md leading-6 text-on-primary/75">{audience.description}</p><ul className="mt-5 space-y-2 border-t border-on-primary/15 pt-4 text-label-sm text-on-primary-container">{audience.items.map((item) => <li key={item}>{item}</li>)}</ul></article>; })}</div></div></section><section className="container-main py-16 md:py-24" aria-labelledby="service-process-title"><div className="max-w-2xl"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Alur layanan</p><h2 id="service-process-title" className="mt-2 text-3xl font-bold tracking-tight text-on-surface">Empat Langkah untuk Memulai</h2></div><ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{STEPS.map((step, index) => { const Icon = step.icon; return <li key={step.title} className="relative rounded-2xl bg-surface-container-low p-6"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-label-sm font-label-sm text-on-primary">{index + 1}</span><Icon className="mt-6 h-7 w-7 text-primary" aria-hidden="true" /><h3 className="mt-4 text-headline-sm font-headline-sm text-on-surface">{step.title}</h3><p className="mt-2 text-body-md leading-6 text-on-surface-variant">{step.description}</p></li>; })}</ol></section></>;
}
