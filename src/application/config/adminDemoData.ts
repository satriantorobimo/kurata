export type ReviewStatus = "pending" | "under_review" | "verified" | "changes_requested" | "rejected" | "published" | "draft";

export interface ReviewAttachment {
  id: string;
  name: string;
  type: "photo" | "certificate" | "document";
  status: "complete" | "needs_review" | "missing";
  note: string;
  previewUrl?: string;
}

export interface ReviewRecord {
  id: string;
  name: string;
  email?: string;
  subtitle: string;
  submittedAt: string;
  status: ReviewStatus;
  details: string[];
  attachments?: ReviewAttachment[];
}

export const ADMIN_DEMO_DATA = {
  users: [
    { id: "USR-2048", name: "Nadia Pratama", email: "nadia.pratama@email.com", subtitle: "Pemohon verifikasi akun", submittedAt: "Hari ini, 09.24", status: "pending", details: ["Domisili: Jakarta Selatan", "Nomor WhatsApp sudah dikonfirmasi", "Tujuan akun: mencari tanah investasi"] },
    { id: "USR-2047", name: "Rizky Maulana", email: "rizky.maulana@email.com", subtitle: "Pemohon verifikasi akun", submittedAt: "Kemarin, 16.40", status: "under_review", details: ["Domisili: Bandung", "Nomor WhatsApp sudah dikonfirmasi", "Tujuan akun: pembelian tanah hunian"] },
    { id: "USR-2041", name: "Citra Lestari", email: "citra.lestari@email.com", subtitle: "Akun terverifikasi", submittedAt: "22 Jul 2026", status: "verified", details: ["Domisili: Surabaya", "Verifikasi selesai oleh Tim Kurata", "Akun aktif"] },
  ] satisfies ReviewRecord[],
  brokers: [
    { id: "BRK-M3K7-AP9Q", name: "Dimas Wibowo", email: "dimas@wibowoland.id", subtitle: "Wibowo Land · Mitra Kurata independen", submittedAt: "Hari ini, 08.15", status: "pending", details: ["Area: Jakarta Selatan, Depok, Bogor", "Pengalaman: 3–5 tahun", "Spesialisasi: Tanah hunian, tanah komersial"] },
    { id: "BRK-N7H2-Q4VL", name: "Salsabila Kurnia", email: "salsabila@kurniaproperty.id", subtitle: "Kurnia Property · Agency", submittedAt: "Kemarin, 11.35", status: "under_review", details: ["Area: Badung, Denpasar", "Pengalaman: lebih dari 5 tahun", "Spesialisasi: Tanah hunian, tanah investasi"] },
    { id: "BRK-A9K1-T8WX", name: "Fajar Nugroho", email: "fajar@tanahutama.id", subtitle: "Tanah Utama · Mitra Kurata", submittedAt: "18 Jul 2026", status: "verified", details: ["Area: Yogyakarta dan Sleman", "Status kemitraan: aktif", "12 listing aktif"] },
  ] satisfies ReviewRecord[],
  assets: [
    { id: "AST-1058", name: "Tanah Komersial Akses Tol Karawang", subtitle: "Diajukan oleh Fajar Nugroho · Rp8,5 M", submittedAt: "Hari ini, 10.10", status: "pending", details: ["Luas: 5.000 m²", "Sertifikat: HGB", "Dokumen listing dan foto telah dilampirkan"], attachments: [{ id: "ATT-1", name: "Foto utama lokasi", type: "photo", status: "complete", note: "JPG · 2,4 MB", previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop" }, { id: "ATT-2", name: "Foto akses jalan", type: "photo", status: "complete", note: "JPG · 1,8 MB", previewUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&h=600&fit=crop" }, { id: "ATT-3", name: "Sertifikat HGB", type: "certificate", status: "needs_review", note: "PDF · 3 halaman · periksa masa berlaku" }, { id: "ATT-4", name: "Peta lokasi & titik koordinat", type: "document", status: "complete", note: "PDF · 1 halaman" }] },
    { id: "AST-1057", name: "Kavling View Sawah di Ubud", subtitle: "Diajukan oleh Salsabila Kurnia · Rp2,1 M", submittedAt: "Kemarin, 14.05", status: "under_review", details: ["Luas: 850 m²", "Sertifikat: SHM", "Menunggu klarifikasi akses jalan"], attachments: [{ id: "ATT-5", name: "Foto utama kavling", type: "photo", status: "complete", note: "JPG · 2,1 MB", previewUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&h=600&fit=crop" }, { id: "ATT-6", name: "Sertifikat SHM", type: "certificate", status: "complete", note: "PDF · 2 halaman" },     { id: "ATT-7", name: "Surat akses jalan", type: "document", status: "missing", note: "Belum dilampirkan oleh Mitra Kurata" }] },
    { id: "AST-1044", name: "Tanah Strategis Dekat Kota Batu", subtitle: "Diajukan oleh Fajar Nugroho · Rp1,25 M", submittedAt: "20 Jul 2026", status: "published", details: ["Luas: 1.200 m²", "Sertifikat: HGB", "Tayang di Cari Tanah"], attachments: [{ id: "ATT-8", name: "Foto utama aset", type: "photo", status: "complete", note: "JPG · 1,9 MB", previewUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&h=600&fit=crop" }, { id: "ATT-9", name: "Sertifikat HGB", type: "certificate", status: "complete", note: "PDF · 3 halaman" }] },
  ] satisfies ReviewRecord[],
  content: [
    { id: "CNT-301", name: "Cara Memeriksa Legalitas Tanah Sebelum Membeli", subtitle: "Blog · Edukasi pertanahan", submittedAt: "Hari ini, 11.20", status: "under_review", details: ["Penulis: Tim Kurata", "Kategori: Legalitas", "SEO description sudah tersedia"] },
    { id: "CNT-300", name: "Panduan Membaca Sertifikat HGB", subtitle: "Blog · Edukasi pertanahan", submittedAt: "Kemarin, 09.45", status: "draft", details: ["Penulis: Tim Kurata", "Kategori: Sertifikat", "Belum diajukan untuk peninjauan"] },
    { id: "CNT-288", name: "Memulai Pencarian Tanah yang Tepat", subtitle: "Bantuan · Panduan pengguna", submittedAt: "19 Jul 2026", status: "published", details: ["Terakhir diperbarui: 19 Jul 2026", "Tayang di pusat bantuan", "Bahasa: Indonesia"] },
  ] satisfies ReviewRecord[],
};
