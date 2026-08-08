export type WorkspaceStatus = "pending" | "under_review" | "changes_requested" | "published" | "draft" | "not_started" | "approved" | "submitted";

export const WORKSPACE_STATUS: Record<WorkspaceStatus, { label: string; className: string }> = {
  not_started: { label: "Belum diverifikasi", className: "bg-surface-container-high text-on-surface-variant" },
  submitted: { label: "Diajukan", className: "bg-amber-100 text-amber-800" },
  pending: { label: "Menunggu verifikasi", className: "bg-amber-100 text-amber-800" },
  under_review: { label: "Sedang ditinjau", className: "bg-blue-100 text-blue-800" },
  changes_requested: { label: "Perlu perbaikan", className: "bg-orange-100 text-orange-800" },
  approved: { label: "Terverifikasi", className: "bg-emerald-100 text-emerald-800" },
  published: { label: "Terverifikasi", className: "bg-emerald-100 text-emerald-800" },
  draft: { label: "Draf", className: "bg-surface-container-high text-on-surface-variant" },
};
