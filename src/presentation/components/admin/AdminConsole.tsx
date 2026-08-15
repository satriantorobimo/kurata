"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, ClipboardCheck, Eye, FileCheck2, FileImage, FileText, LayoutDashboard, Search, ShieldCheck, UserRoundCheck, UsersRound, XCircle } from "lucide-react";
import type { ReviewAttachment, ReviewRecord, ReviewStatus } from "@/application/config/adminDemoData";
import { updateAssetReviewStatus, updateFormReviewStatus, type ReviewActionResult } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

type Section = "overview" | "users" | "brokers" | "assets" | "content";
type Collection = Exclude<Section, "overview">;

const LABELS: Record<ReviewStatus, string> = { pending: "Menunggu", under_review: "Ditinjau", verified: "Terverifikasi", changes_requested: "Perlu perbaikan", rejected: "Ditolak", published: "Tayang", draft: "Draf" };
const STATUS_CLASS: Record<ReviewStatus, string> = { pending: "bg-amber-100 text-amber-800", under_review: "bg-blue-100 text-blue-800", verified: "bg-emerald-100 text-emerald-800", changes_requested: "bg-orange-100 text-orange-800", rejected: "bg-red-100 text-red-800", published: "bg-emerald-100 text-emerald-800", draft: "bg-surface-container-high text-on-surface-variant" };
const SECTION_META: Record<Collection, { title: string; eyebrow: string; icon: typeof UsersRound }> = {
  users: { title: "Verifikasi Pengguna", eyebrow: "Akun pengguna", icon: UsersRound },
  brokers: { title: "Verifikasi Mitra Kurata", eyebrow: "Kemitraan mitra", icon: UserRoundCheck },
  assets: { title: "Persetujuan Aset", eyebrow: "Listing mitra", icon: ClipboardCheck },
  content: { title: "Konten", eyebrow: "Blog dan bantuan", icon: FileText },
};

export interface AdminData {
  users: ReviewRecord[];
  brokers: ReviewRecord[];
  assets: ReviewRecord[];
  content: ReviewRecord[];
}

function StatusPill({ status }: { status: ReviewStatus }) { return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-label-sm font-label-sm", STATUS_CLASS[status])}>{LABELS[status]}</span>; }

export function AdminConsole({ initialData }: { initialData: AdminData }) {
  const [section, setSection] = useState<Section>("overview");
  const [data, setData] = useState(initialData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [, startTransition] = useTransition();
  const collection = section === "overview" ? null : section;
  const records = useMemo(() => collection ? data[collection] : [], [collection, data]);
  const filtered = useMemo(() => records.filter((item) => `${item.name} ${item.subtitle}`.toLowerCase().includes(query.toLowerCase())), [records, query]);
  const selected = records.find((item) => item.id === selectedId) ?? null;
  const allReviewRecords: ReviewRecord[] = [...data.users, ...data.brokers, ...data.assets];
  const pendingCount = allReviewRecords.filter((item) => item.status === "pending" || item.status === "under_review").length;

  const updateStatus = (status: ReviewStatus) => {
    if (!collection || !selected) return;
    const entityId = selected.entityId ?? selected.id;
    const previous = data;
    setData((current) => ({ ...current, [collection]: current[collection].map((item) => item.id === selected.id ? { ...item, status } : item) }));
    setNotice(`${selected.name} diperbarui menjadi “${LABELS[status]}”.`);

    const action = collection === "assets"
      ? updateAssetReviewStatus(entityId, status)
      : collection === "brokers"
        ? updateFormReviewStatus(entityId, status)
        : null;

    if (!action) return;
    startTransition(async () => {
      const result: ReviewActionResult = await action;
      if (!result.ok) {
        setData(previous);
        setNotice(result.message);
      }
    });
  };

  const nav = [
    { id: "overview" as const, label: "Ringkasan", icon: LayoutDashboard },
    { id: "users" as const, label: "Pengguna", icon: UsersRound },
    { id: "brokers" as const, label: "Mitra Kurata", icon: UserRoundCheck },
    { id: "assets" as const, label: "Aset", icon: ClipboardCheck },
    { id: "content" as const, label: "Konten", icon: FileText },
  ];

  return <div className="min-h-screen bg-background pt-20">
    <div className="container-main py-8 md:py-12">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Kurata workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Pusat Administrasi</h1><p className="mt-2 max-w-2xl text-body-md leading-6 text-on-surface-variant">Tinjau pengguna, kemitraan mitra, listing, dan konten dari satu tempat.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-2 text-label-sm text-emerald-900"><ShieldCheck className="h-4 w-4" />Terhubung ke database produksi</span></div>
      {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-body-md text-primary" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Tutup notifikasi"><XCircle className="h-4 w-4" /></button></div>}
      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]"><aside className="h-fit rounded-2xl border border-border-subtle bg-surface-container-lowest p-3 shadow-card"><nav className="flex gap-1 overflow-x-auto lg:flex-col">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setSelectedId(null); setQuery(""); }} className={cn("flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-label-md transition-colors", section === id ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary")}><Icon className="h-5 w-5" />{label}{id !== "overview" && <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[11px]", section === id ? "bg-white/20" : "bg-surface-container-high")}>{data[id].filter((item) => item.status === "pending" || item.status === "under_review").length}</span>}</button>)}</nav></aside>
        <main>{section === "overview" ? <Overview data={data} pendingCount={pendingCount} onNavigate={(next) => setSection(next)} /> : <ReviewSection title={SECTION_META[section].title} eyebrow={SECTION_META[section].eyebrow} records={filtered} total={records.length} query={query} onQuery={setQuery} selected={selected} onSelect={(id) => section === "assets" ? window.location.assign(`/admin/assets/${id}`) : setSelectedId(id)} onUpdate={updateStatus} approveStatus={section === "brokers" || section === "assets" || section === "content" ? "published" : "verified"} />}</main>
      </div>
    </div>
  </div>;
}

function Overview({ data, pendingCount, onNavigate }: { data: AdminData; pendingCount: number; onNavigate: (section: Collection) => void }) {
  const cards: { section: Collection; label: string; value: number; hint: string; icon: typeof UsersRound }[] = [
    { section: "users", label: "Pengguna menunggu", value: data.users.filter((x) => x.status === "pending" || x.status === "under_review").length, hint: "Perlu pemeriksaan profil", icon: UsersRound },
    { section: "brokers", label: "Aplikasi mitra", value: data.brokers.filter((x) => x.status === "pending" || x.status === "under_review").length, hint: "Menunggu keputusan kemitraan", icon: UserRoundCheck },
    { section: "assets", label: "Aset untuk ditinjau", value: data.assets.filter((x) => x.status === "pending" || x.status === "under_review").length, hint: "Belum tampil ke publik", icon: ClipboardCheck },
    { section: "content", label: "Konten kerja", value: data.content.filter((x) => x.status !== "published").length, hint: "Draf dan artikel dalam review", icon: FileText },
  ];
  return <><section className="rounded-2xl bg-primary p-6 text-on-primary md:p-8"><p className="text-label-sm font-label-sm uppercase tracking-wider text-on-primary-container">Prioritas hari ini</p><div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h2 className="text-3xl font-bold">{pendingCount} item perlu ditinjau</h2><p className="mt-2 max-w-xl leading-6 text-on-primary/80">Selesaikan pemeriksaan pengguna, mitra, dan aset agar proses di Kurata tetap transparan dan terjaga.</p></div><button onClick={() => onNavigate("users")} className="rounded-xl bg-white px-4 py-3 text-label-md font-label-md text-primary hover:bg-surface-container-low">Mulai tinjau</button></div></section><section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ section, label, value, hint, icon: Icon }) => <button key={section} onClick={() => onNavigate(section)} className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-5 text-left shadow-card transition-transform hover:-translate-y-0.5"><Icon className="h-6 w-6 text-primary" /><p className="mt-5 text-3xl font-bold text-on-surface">{value}</p><h3 className="mt-1 text-label-md font-label-md text-on-surface">{label}</h3><p className="mt-1 text-label-sm leading-5 text-on-surface-variant">{hint}</p></button>)}</section><section className="mt-8 rounded-2xl border border-border-subtle bg-surface-container-lowest p-6"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /><div><h2 className="font-bold text-on-surface">Prinsip review Kurata</h2><p className="mt-1 text-body-md text-on-surface-variant">Setiap keputusan perlu alasan yang jelas, catatan internal, dan riwayat audit saat database produksi dihubungkan.</p></div></div></section></>;
}

function AttachmentPanel({ attachments }: { attachments: ReviewAttachment[] }) {
  const photos = attachments.filter((attachment) => attachment.type === "photo");
  const documents = attachments.filter((attachment) => attachment.type !== "photo");
  const statusLabel = { complete: "Lengkap", needs_review: "Perlu periksa", missing: "Belum ada" } as const;
  const statusClass = { complete: "bg-emerald-100 text-emerald-800", needs_review: "bg-amber-100 text-amber-800", missing: "bg-red-100 text-red-800" } as const;

  return <section className="mt-5 border-b border-border-subtle pb-5"><div className="flex items-center justify-between gap-3"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Lampiran verifikasi</p><p className="mt-1 text-label-sm text-on-surface-variant">{attachments.length} berkas diajukan Mitra Kurata</p></div></div>{photos.length > 0 && <div className="mt-4 grid grid-cols-2 gap-2">{photos.map((photo) => <article key={photo.id} className="overflow-hidden rounded-lg border border-border-subtle bg-surface-container-low"><div className="h-24 bg-surface-container-high bg-cover bg-center" style={photo.previewUrl ? { backgroundImage: `url(${photo.previewUrl})` } : undefined} /><div className="flex items-center justify-between gap-2 p-2"><p className="truncate text-[11px] font-medium text-on-surface">{photo.name}</p><Eye className="h-3.5 w-3.5 shrink-0 text-primary" /></div></article>)}</div>}{documents.length > 0 && <div className="mt-3 space-y-2">{documents.map((document) => <article key={document.id} className="flex items-center gap-3 rounded-lg border border-border-subtle p-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{document.type === "certificate" ? <FileCheck2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}</div><div className="min-w-0 flex-1"><p className="truncate text-label-sm font-label-sm text-on-surface">{document.name}</p><p className="mt-0.5 text-[11px] text-on-surface-variant">{document.note}</p></div><span className={cn("shrink-0 rounded-full px-2 py-1 text-[10px] font-bold", statusClass[document.status])}>{statusLabel[document.status]}</span></article>)}</div>}<p className="mt-3 flex gap-2 text-[11px] leading-4 text-on-surface-variant"><FileImage className="h-3.5 w-3.5 shrink-0 text-primary" />Dalam produksi, foto dan dokumen harus disimpan privat dan hanya dapat dibuka oleh reviewer berwenang.</p></section>;
}

function ReviewSection({ title, eyebrow, records, total, query, onQuery, selected, onSelect, onUpdate, approveStatus }: { title: string; eyebrow: string; records: ReviewRecord[]; total: number; query: string; onQuery: (value: string) => void; selected: ReviewRecord | null; onSelect: (id: string) => void; onUpdate: (status: ReviewStatus) => void; approveStatus: "verified" | "published" }) {
  return <><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">{eyebrow}</p><h2 className="mt-2 text-3xl font-bold text-on-surface">{title}</h2><p className="mt-2 text-body-md text-on-surface-variant">{total} data dalam antrian dan arsip demo.</p></div><label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Cari nama atau keterangan" className="w-full rounded-xl border border-border-subtle bg-surface-container-lowest py-2.5 pl-10 pr-4 text-body-md outline-none focus:border-primary sm:w-64" /></label></div><div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card"><div className="divide-y divide-border-subtle">{records.map((record) => <button key={record.id} onClick={() => onSelect(record.id)} className={cn("flex w-full items-center gap-4 px-5 py-4 text-left transition-colors", selected?.id === record.id ? "bg-primary/5" : "hover:bg-surface-container-low")}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label-md font-bold text-primary">{record.name.slice(0, 1)}</div><div className="min-w-0 flex-1"><p className="truncate text-label-md font-label-md text-on-surface">{record.name}</p><p className="mt-1 truncate text-label-sm text-on-surface-variant">{record.subtitle}</p><p className="mt-1 text-label-sm text-outline">{record.id} · {record.submittedAt}</p></div><StatusPill status={record.status} /></button>)}{records.length === 0 && <p className="px-5 py-12 text-center text-body-md text-on-surface-variant">Tidak ada data yang sesuai.</p>}</div></div><aside className="h-fit rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">{selected ? <><div className="flex items-start justify-between gap-3"><div><p className="text-label-sm text-outline">{selected.id}</p><h3 className="mt-1 text-xl font-bold text-on-surface">{selected.name}</h3>{selected.email && <p className="mt-1 text-body-md text-on-surface-variant">{selected.email}</p>}</div><StatusPill status={selected.status} /></div><div className="mt-6 border-y border-border-subtle py-5"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Informasi peninjauan</p><ul className="mt-3 space-y-3">{selected.details.map((detail) => <li key={detail} className="text-body-md leading-6 text-on-surface-variant">{detail}</li>)}</ul></div>{selected.attachments && <AttachmentPanel attachments={selected.attachments} />}<div className="mt-5"><p className="text-label-sm font-label-sm text-on-surface">Keputusan</p><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => onUpdate(approveStatus)} className="rounded-lg bg-primary px-3 py-2.5 text-label-sm font-label-sm text-on-primary hover:bg-primary/90">Setujui</button><button onClick={() => onUpdate("changes_requested")} className="rounded-lg border border-primary px-3 py-2.5 text-label-sm font-label-sm text-primary hover:bg-primary/5">Minta perbaikan</button><button onClick={() => onUpdate("under_review")} className="rounded-lg bg-surface-container-low px-3 py-2.5 text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container">Tandai ditinjau</button><button onClick={() => onUpdate("rejected")} className="rounded-lg bg-error-container px-3 py-2.5 text-label-sm font-label-sm text-on-error-container hover:opacity-90">Tolak</button></div></div></> : <div className="py-12 text-center"><ClipboardCheck className="mx-auto h-10 w-10 text-primary/50" /><p className="mt-4 text-body-md text-on-surface-variant">Pilih data untuk melihat detail dan mengambil keputusan.</p></div>}</aside></div></>;
}
