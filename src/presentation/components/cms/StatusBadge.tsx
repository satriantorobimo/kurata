import { cn } from "@/lib/cn";

const LABELS: Record<string, string> = {
  pending: "Menunggu",
  under_review: "Ditinjau",
  changes_requested: "Perlu perbaikan",
  rejected: "Ditolak",
  published: "Tayang",
  draft: "Draf",
  active: "Aktif",
  suspended: "Ditangguhkan",
  archived: "Diarsipkan",
  not_started: "Belum dimulai",
  submitted: "Diajukan",
  approved: "Disetujui",
  verified: "Terverifikasi",
  user: "Pengguna",
  broker: "Mitra Kurata",
  admin: "Admin",
  super_admin: "Master Admin",
  exclusive: "Exclusive",
  broker_application: "Pengajuan mitra",
  service_inquiry: "Konsultasi layanan",
  investment_inquiry: "Minat investasi",
  support_request: "Permintaan bantuan",
  true: "Ya",
  false: "Tidak",
};

const CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  under_review: "bg-blue-100 text-blue-800",
  changes_requested: "bg-orange-100 text-orange-800",
  rejected: "bg-red-100 text-red-800",
  published: "bg-emerald-100 text-emerald-800",
  draft: "bg-surface-container-high text-on-surface-variant",
  active: "bg-emerald-100 text-emerald-800",
  suspended: "bg-amber-100 text-amber-800",
  archived: "bg-surface-container-high text-on-surface-variant",
  not_started: "bg-surface-container-high text-on-surface-variant",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-emerald-100 text-emerald-800",
  verified: "bg-emerald-100 text-emerald-800",
  user: "bg-surface-container-high text-on-surface-variant",
  broker: "bg-badge-teal/10 text-badge-teal",
  admin: "bg-blue-100 text-blue-800",
  super_admin: "bg-violet-100 text-violet-800",
  broker_application: "bg-emerald-100 text-emerald-800",
  service_inquiry: "bg-blue-100 text-blue-800",
  investment_inquiry: "bg-violet-100 text-violet-800",
  support_request: "bg-amber-100 text-amber-800",
  exclusive: "bg-primary text-on-primary",
};

interface StatusBadgeProps {
  value: string | boolean | null | undefined;
  label?: string;
  className?: string;
}

export function StatusBadge({ value, label, className }: StatusBadgeProps) {
  const key = value === null || value === undefined ? "" : String(value);
  const classes = CLASS[key] ?? "bg-surface-container-high text-on-surface-variant";
  const text = label ?? LABELS[key] ?? key;

  return <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-label-sm font-label-sm", classes, className)}>{text}</span>;
}