import { Statistic } from "../../domain/entities/Statistic";

export const mockStatistics: Statistic[] = [
  Statistic.create({ id: "stat-1", label: "Tanah Terdaftar", value: "12.500+", icon: "landmark" }),
  Statistic.create({ id: "stat-2", label: "Mitra Kurata", value: "650+", icon: "users" }),
  Statistic.create({ id: "stat-3", label: "Transaksi Sukses", value: "2.800+", icon: "badge-check" }),
  Statistic.create({ id: "stat-4", label: "Nilai Transaksi", value: "Rp 5,2 Triliun+", icon: "trending-up" }),
];
