export type WorkspaceStatus = "pending" | "under_review" | "changes_requested" | "published" | "draft";

export const USER_WORKSPACE = {
  name: "Nadia Pratama",
  verification: "under_review" as WorkspaceStatus,
  favoriteProperties: [
    { id: "prop-001", title: "Tanah View Laut - Gunungkidul", location: "Gunungkidul, D.I. Yogyakarta", price: "Rp850 jt", imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&h=600&fit=crop" },
    { id: "prop-006", title: "Kavling Siap Bangun Canggu", location: "Badung, Bali", price: "Rp2,75 M", imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&h=600&fit=crop" },
  ],
  inquiries: [
    { id: "INQ-2026-0081", title: "Tanah View Laut - Gunungkidul", broker: "Kurata Advisory", status: "Menunggu dihubungi", updatedAt: "Hari ini, 09.40" },
    { id: "INQ-2026-0064", title: "Kavling Premium - Bogor Barat", broker: "Dimas Wibowo", status: "Jadwal konsultasi", updatedAt: "29 Jul 2026" },
  ],
};

export const BROKER_WORKSPACE = {
  name: "Fajar Nugroho",
  verification: "published" as WorkspaceStatus,
  assets: [
    { id: "AST-1058", title: "Tanah Komersial Akses Tol Karawang", location: "Karawang Barat, Jawa Barat", price: "Rp8,5 M", status: "under_review" as WorkspaceStatus, updatedAt: "Hari ini, 10.10", issue: null },
    { id: "AST-1057", title: "Kavling View Sawah di Ubud", location: "Ubud, Bali", price: "Rp2,1 M", status: "changes_requested" as WorkspaceStatus, updatedAt: "Kemarin, 14.05", issue: "Lengkapi surat akses jalan sebelum diajukan kembali." },
    { id: "AST-1044", title: "Tanah Strategis Dekat Kota Batu", location: "Batu, Jawa Timur", price: "Rp1,25 M", status: "published" as WorkspaceStatus, updatedAt: "20 Jul 2026", issue: null },
    { id: "AST-1059", title: "Lahan Perkebunan Produktif", location: "Jember, Jawa Timur", price: "Rp3,6 M", status: "draft" as WorkspaceStatus, updatedAt: "18 Jul 2026", issue: null },
  ],
};

export const WORKSPACE_STATUS = {
  pending: { label: "Menunggu verifikasi", className: "bg-amber-100 text-amber-800" },
  under_review: { label: "Sedang ditinjau", className: "bg-blue-100 text-blue-800" },
  changes_requested: { label: "Perlu perbaikan", className: "bg-orange-100 text-orange-800" },
  published: { label: "Terverifikasi", className: "bg-emerald-100 text-emerald-800" },
  draft: { label: "Draf", className: "bg-surface-container-high text-on-surface-variant" },
} as const;
