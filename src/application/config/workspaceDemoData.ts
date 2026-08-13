export type WorkspaceStatus = "pending" | "under_review" | "changes_requested" | "published" | "draft" | "not_started" | "approved" | "submitted";

export const WORKSPACE_STATUS: Record<WorkspaceStatus, { label: string; className: string }> = {
  not_started: { label: "Belum diverifikasi", className: "bg-status-neutral-container text-status-neutral" },
  submitted: { label: "Diajukan", className: "bg-status-warning-container text-status-warning" },
  pending: { label: "Menunggu verifikasi", className: "bg-status-warning-container text-status-warning" },
  under_review: { label: "Sedang ditinjau", className: "bg-status-info-container text-status-info" },
  changes_requested: { label: "Perlu perbaikan", className: "bg-status-attention-container text-status-attention" },
  approved: { label: "Terverifikasi", className: "bg-status-success-container text-status-success" },
  published: { label: "Terverifikasi", className: "bg-status-success-container text-status-success" },
  draft: { label: "Draf", className: "bg-status-neutral-container text-status-neutral" },
};
