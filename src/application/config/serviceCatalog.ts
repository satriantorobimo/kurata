import type { ServiceType } from "../../domain/entities/ServiceInquiry";

export interface ServiceDefinition {
  id: ServiceType;
  title: string;
  shortTitle: string;
  description: string;
  audience: string;
  deliverables: string[];
  disclaimer?: string;
}

export const SERVICE_CATALOG: ServiceDefinition[] = [
  {
    id: "property-search",
    title: "Pencarian dan Kurasi Tanah",
    shortTitle: "Cari Tanah",
    description: "Bantu susun kebutuhan dan temukan listing yang relevan dengan lokasi, anggaran, serta tujuan Anda.",
    audience: "Pembeli dan investor",
    deliverables: ["Pemetaan kebutuhan", "Shortlist listing awal", "Arahan proses pencarian"],
  },
  {
    id: "initial-information-review",
    title: "Pemeriksaan Informasi Awal",
    shortTitle: "Pemeriksaan Awal",
    description: "Tinjau kelengkapan informasi listing dan dokumen yang tersedia sebelum melangkah lebih jauh.",
    audience: "Pemilik, pembeli, dan investor",
    deliverables: ["Checklist informasi", "Identifikasi data yang belum lengkap", "Arahan verifikasi lanjutan"],
    disclaimer: "Bukan opini hukum atau jaminan legalitas final.",
  },
  {
    id: "indicative-price-estimate",
    title: "Estimasi Harga Indikatif",
    shortTitle: "Estimasi Harga",
    description: "Dapatkan gambaran awal rentang harga berdasarkan informasi listing dan konteks pasar yang tersedia.",
    audience: "Pemilik dan investor",
    deliverables: ["Perbandingan harga awal", "Konteks harga per area", "Rentang indikatif untuk perencanaan"],
    disclaimer: "Bukan penilaian resmi dari penilai berlisensi.",
  },
  {
    id: "property-marketing",
    title: "Pemasaran Properti",
    shortTitle: "Pasarkan Tanah",
    description: "Siapkan informasi listing yang jelas dan perluas peluang pemasaran melalui ekosistem Kurata.",
    audience: "Pemilik tanah",
    deliverables: ["Panduan informasi listing", "Persiapan publikasi", "Distribusi melalui jaringan yang relevan"],
  },
  {
    id: "broker-connection",
    title: "Koneksi Broker Partner",
    shortTitle: "Temukan Broker",
    description: "Temukan kemungkinan koneksi dengan broker yang sesuai dengan area dan fokus properti Anda.",
    audience: "Pemilik, pembeli, dan investor",
    deliverables: ["Pemetaan area", "Pertimbangan spesialisasi", "Pengantar awal kemitraan"],
  },
  {
    id: "transaction-guidance",
    title: "Pendampingan Proses Transaksi",
    shortTitle: "Panduan Transaksi",
    description: "Dapatkan struktur proses dan checklist kesiapan untuk melanjutkan transaksi bersama profesional terkait.",
    audience: "Pemilik, pembeli, dan investor",
    deliverables: ["Checklist tahapan", "Arahan kesiapan dokumen", "Rujukan kebutuhan profesional"],
    disclaimer: "Tidak menggantikan notaris, PPAT, surveyor, atau penasihat hukum.",
  },
];

export function getServiceDefinition(id: ServiceType): ServiceDefinition {
  return SERVICE_CATALOG.find((service) => service.id === id)!;
}
