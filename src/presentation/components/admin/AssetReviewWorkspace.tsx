"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, ClipboardCheck, FileCheck2, FileText, MapPinned, ShieldCheck, UserRoundCheck } from "lucide-react";
import type { ReviewAttachment, ReviewRecord } from "@/application/config/adminDemoData";
import { cn } from "@/lib/cn";

const CHECKS = [
  "Informasi aset lengkap dan dapat dipahami.",
  "Lokasi serta luas sesuai dengan data pendukung.",
  "Jenis sertifikat sesuai dengan informasi listing.",
  "Dokumen sertifikat dapat dibaca dan diperiksa.",
  "Foto merepresentasikan aset yang diajukan.",
  "Informasi akses jalan telah dijelaskan.",
  "Tidak ditemukan duplikasi listing aktif.",
  "Data publik tidak mengandung informasi sensitif.",
];

const attachmentStatus = {
  complete: { label: "Lengkap", className: "bg-emerald-100 text-emerald-800" },
  needs_review: { label: "Perlu periksa", className: "bg-amber-100 text-amber-800" },
  missing: { label: "Belum ada", className: "bg-red-100 text-red-800" },
} as const;

export function AssetReviewWorkspace({ asset }: { asset: ReviewRecord }) {
  const photos = asset.attachments?.filter((item) => item.type === "photo") ?? [];
  const documents = asset.attachments?.filter((item) => item.type !== "photo") ?? [];
  const [activePhoto, setActivePhoto] = useState(0);
  const [checked, setChecked] = useState<boolean[]>(CHECKS.map(() => false));
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<"approved" | "changes" | "rejected" | null>(null);
  const completed = useMemo(() => checked.filter(Boolean).length, [checked]);
  const canApprove = completed === CHECKS.length && documents.every((item) => item.status !== "missing") && note.trim().length >= 8;
  const currentPhoto = photos[activePhoto];

  function toggleCheck(index: number) {
    setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value));
  }

  return <div className="min-h-screen bg-background pt-20">
    <div className="container-main py-8 md:py-12">
      <Link href="/admin" className="inline-flex items-center gap-2 text-label-md font-label-md text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Kembali ke antrian aset</Link>
      <div className="mt-6 flex flex-col justify-between gap-5 border-b border-border-subtle pb-7 lg:flex-row lg:items-end"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Review aset · {asset.id}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">{asset.name}</h1><p className="mt-3 text-body-md text-on-surface-variant">{asset.subtitle} · Diajukan {asset.submittedAt}</p></div><span className="inline-flex w-fit rounded-full bg-amber-100 px-3 py-2 text-label-sm font-label-sm text-amber-800">Menunggu keputusan</span></div>

      {decision && <div className={cn("mt-6 flex items-start gap-3 rounded-xl border p-4 text-body-md", decision === "approved" ? "border-primary/20 bg-primary/5 text-primary" : "border-amber-200 bg-amber-50 text-amber-900")} role="status">{decision === "approved" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />}<span>{decision === "approved" ? "Aset ditandai siap tayang dalam mode demo." : decision === "changes" ? "Permintaan perbaikan dicatat dalam mode demo." : "Penolakan dicatat dalam mode demo."}</span></div>}

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card"><div className="aspect-[16/9] bg-surface-container-high bg-cover bg-center" style={currentPhoto?.previewUrl ? { backgroundImage: `url(${currentPhoto.previewUrl})` } : undefined}>{!currentPhoto && <div className="flex h-full items-center justify-center text-body-md text-on-surface-variant">Foto belum tersedia</div>}</div>{photos.length > 0 && <div className="flex gap-3 overflow-x-auto p-4">{photos.map((photo, index) => <button key={photo.id} onClick={() => setActivePhoto(index)} className={cn("h-20 w-28 shrink-0 rounded-lg bg-surface-container-high bg-cover bg-center ring-offset-2", activePhoto === index && "ring-2 ring-primary")} style={photo.previewUrl ? { backgroundImage: `url(${photo.previewUrl})` } : undefined} aria-label={`Lihat ${photo.name}`} />)}</div>}</section>

          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Informasi aset</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><Info label="Harga penawaran" value={asset.subtitle.split("·").at(-1)?.trim() || "-"} /><Info label="Luas tanah" value={asset.details.find((item) => item.startsWith("Luas:"))?.replace("Luas: ", "") || "-"} /><Info label="Jenis sertifikat" value={asset.details.find((item) => item.startsWith("Sertifikat:"))?.replace("Sertifikat: ", "") || "-"} /><Info label="Status listing" value="Belum tayang ke publik" /></div><div className="mt-6 rounded-xl bg-surface-container-low p-4"><div className="flex gap-3"><MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="text-label-md font-label-md text-on-surface">Lokasi terdaftar</p><p className="mt-1 text-body-md text-on-surface-variant">Karawang Barat, Jawa Barat · Titik koordinat dan peta diperiksa melalui dokumen broker.</p></div></div></div></section>

          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><div className="flex items-center gap-3"><UserRoundCheck className="h-5 w-5 text-primary" /><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Broker pengaju</p><h2 className="mt-1 text-xl font-bold text-on-surface">Fajar Nugroho</h2></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Info label="Status broker" value="Broker Partner terverifikasi" /><Info label="Kinerja" value="12 listing aktif" /></div></section>

          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Riwayat aktivitas</p><ol className="mt-5 space-y-5 border-l border-border-subtle pl-5">{["Aset diajukan oleh Fajar Nugroho · Hari ini, 10.10", "Dokumen dan foto dilampirkan · Hari ini, 10.11", "Masuk ke antrean verifikasi listing · Hari ini, 10.12"].map((item, index) => <li key={item} className="relative text-body-md text-on-surface-variant"><span className={cn("absolute -left-[29px] top-1 h-3 w-3 rounded-full", index === 2 ? "bg-primary" : "bg-outline-variant")} />{item}</li>)}</ol></section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-28 xl:h-fit">
          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><div className="flex items-center justify-between gap-3"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Berkas verifikasi</p><p className="mt-1 text-label-sm text-on-surface-variant">{documents.length} dokumen diajukan</p></div><ShieldCheck className="h-6 w-6 text-primary" /></div><div className="mt-5 space-y-3">{documents.map((document) => <DocumentItem key={document.id} document={document} />)}{documents.length === 0 && <p className="text-body-md text-on-surface-variant">Belum ada dokumen yang dilampirkan.</p>}</div><p className="mt-5 rounded-lg bg-amber-50 p-3 text-label-sm leading-5 text-amber-900">Dokumen di demo hanya berupa metadata. Dokumen produksi harus menggunakan akses privat dan tautan sementara.</p></section>
          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><div className="flex items-center justify-between"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Checklist verifikasi</p><p className="mt-1 text-label-sm text-on-surface-variant">{completed}/{CHECKS.length} pemeriksaan selesai</p></div><ClipboardCheck className="h-6 w-6 text-primary" /></div><div className="mt-5 space-y-3">{CHECKS.map((item, index) => <label key={item} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-surface-container-low"><input type="checkbox" checked={checked[index]} onChange={() => toggleCheck(index)} className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary" /><span className="text-label-sm leading-5 text-on-surface-variant">{item}</span></label>)}</div></section>
          <section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Keputusan review</p><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={500} placeholder="Catatan internal wajib diisi sebelum aset disetujui." className="mt-4 w-full resize-y rounded-lg border border-border-subtle px-3 py-2.5 text-body-md outline-none placeholder:text-outline focus:border-primary" /><p className="mt-2 text-label-sm text-on-surface-variant">Persetujuan membutuhkan seluruh checklist dan catatan minimal 8 karakter.</p><div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => setDecision("approved")} disabled={!canApprove} className="rounded-lg bg-primary px-3 py-2.5 text-label-sm font-label-sm text-on-primary disabled:cursor-not-allowed disabled:opacity-40">Setujui & tayangkan</button><button onClick={() => setDecision("changes")} className="rounded-lg border border-primary px-3 py-2.5 text-label-sm font-label-sm text-primary hover:bg-primary/5">Minta perbaikan</button><button onClick={() => setDecision("rejected")} className="col-span-2 rounded-lg bg-error-container px-3 py-2.5 text-label-sm font-label-sm text-on-error-container hover:opacity-90">Tolak aset</button></div></section>
        </aside>
      </div>
    </div>
  </div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-label-sm text-outline">{label}</p><p className="mt-1 text-label-md font-label-md text-on-surface">{value}</p></div>; }

function DocumentItem({ document }: { document: ReviewAttachment }) {
  const state = attachmentStatus[document.status];
  return <article className="flex gap-3 rounded-xl border border-border-subtle p-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{document.type === "certificate" ? <FileCheck2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><p className="text-label-sm font-label-sm text-on-surface">{document.name}</p><p className="mt-1 text-[11px] leading-4 text-on-surface-variant">{document.note}</p><span className={cn("mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-bold", state.className)}>{state.label}</span></div></article>;
}
