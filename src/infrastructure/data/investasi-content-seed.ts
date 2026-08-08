/**
 * Seed content for the Potensi Lahan (investment) page.
 * Loaded into the content store by the database seed script; the runtime page
 * reads these sections from PostgreSQL. Icon values are lucide-react names
 * mapped to components in the presentation layer.
 */
export const INVESTASI_CATEGORIES = [
  { icon: "Factory", label: "Industri" },
  { icon: "Fuel", label: "SPBU" },
  { icon: "Warehouse", label: "Gudang" },
  { icon: "Building2", label: "Perkantoran" },
  { icon: "Store", label: "Ruko" },
  { icon: "Building", label: "Hotel" },
  { icon: "UtensilsCrossed", label: "Restoran" },
  { icon: "Sprout", label: "Pertanian" },
  { icon: "Home", label: "Perumahan" },
  { icon: "TreePalm", label: "Lahan Kosong" },
];

export const INVESTASI_LISTINGS = [
  { title: "Lahan Strategis Cikarang", location: "Cikarang, Jawa Barat", area: "4.500 m²", price: "Rp 2.300.000", imageUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&h=600&fit=crop" },
  { title: "Tanah Dekat Tol Cibitung", location: "Cibitung, Jawa Barat", area: "2.800 m²", price: "Rp 1.850.000", imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop" },
  { title: "Lahan Pesisir Sidoarjo", location: "Sidoarjo, Jawa Timur", area: "6.200 m²", price: "Rp 3.100.000", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop" },
  { title: "Kavling Komersial Palembang", location: "Palembang, Sumatera Selatan", area: "1.900 m²", price: "Rp 1.400.000", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
  { title: "Tanah Corridor Sukabumi", location: "Sukabumi, Jawa Barat", area: "3.400 m²", price: "Rp 1.950.000", imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop" },
];

export const INVESTASI_FEATURES = [
  { icon: "ArrowLeftRight", label: "Gerbang Tol" },
  { icon: "MoveHorizontal", label: "Jalan Lebar" },
  { icon: "Truck", label: "Truk Besar" },
  { icon: "Factory", label: "Dekat Kawasan Industri" },
  { icon: "Car", label: "Lalu Lintas Padat" },
];

export const INVESTASI_OPPORTUNITIES = [
  "Volume kendaraan tinggi 24 jam",
  "Kebutuhan bahan bakar terus tumbuh",
  "Ekspansi kawasan industri sekitar",
  "Potensi pendapatan sewa lahan",
];

export const INVESTASI_AREA_ANALYSIS = [
  { label: "Aksesibilitas", rating: 5 },
  { label: "Potensi lalu lintas", rating: 5 },
  { label: "Pertumbuhan area", rating: 4 },
  { label: "Daya beli sekitar", rating: 4 },
];

export const INVESTASI_INFRASTRUCTURE = [
  { label: "Gerbang tol terdekat", distance: "1,2 km" },
  { label: "Terminal angkutan", distance: "2,8 km" },
  { label: "Kawasan industri", distance: "2,1 km" },
  { label: "Rumah sakit", distance: "5,6 km" },
  { label: "Pusat kota", distance: "8,4 km" },
];

export const INVESTASI_SIMILAR = [
  { title: "Lahan Jl. Raya Serang", location: "Serang, Banten", price: "Rp 1.650.000", imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop" },
  { title: "Kavling Semarang Barat", location: "Semarang, Jawa Tengah", price: "Rp 1.250.000", imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop" },
  { title: "Tanah Akses Tol Kertosono", location: "Kertosono, Jawa Timur", price: "Rp 2.100.000", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" },
  { title: "Lahan Medan Marelan", location: "Medan, Sumatera Utara", price: "Rp 1.150.000", imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop" },
];

export const INVESTASI_SCORE_METRICS = [
  { label: "Aksesibilitas", score: 4.9 },
  { label: "Lokasi strategis", score: 4.7 },
  { label: "Potensi bisnis", score: 4.8 },
  { label: "Infrastruktur", score: 4.6 },
  { label: "Legalitas", score: 5.0 },
];

export const INVESTASI_BROKER = {
  name: "Rizky Pratama",
  location: "Jakarta",
  rating: 5.0,
  reviewCount: 128,
  imagePath: "/broker.png",
};
