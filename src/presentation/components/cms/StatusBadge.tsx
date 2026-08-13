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
  pending: "bg-status-warning-container text-status-warning",
  under_review: "bg-status-info-container text-status-info",
  changes_requested: "bg-status-attention-container text-status-attention",
  rejected: "bg-error-container text-on-error-container",
  published: "bg-status-success-container text-status-success",
  draft: "bg-status-neutral-container text-status-neutral",
  active: "bg-status-success-container text-status-success",
  suspended: "bg-status-warning-container text-status-warning",
  archived: "bg-status-neutral-container text-status-neutral",
  not_started: "bg-status-neutral-container text-status-neutral",
  submitted: "bg-status-info-container text-status-info",
  approved: "bg-status-success-container text-status-success",
  verified: "bg-status-success-container text-status-success",
  user: "bg-status-neutral-container text-status-neutral",
  broker: "bg-badge-teal/10 text-badge-teal",
  admin: "bg-status-info-container text-status-info",
  super_admin: "bg-tertiary-container text-on-tertiary-container",
  broker_application: "bg-status-success-container text-status-success",
  service_inquiry: "bg-status-info-container text-status-info",
  investment_inquiry: "bg-tertiary-container text-on-tertiary-container",
  support_request: "bg-status-warning-container text-status-warning",
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
