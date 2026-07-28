import { Property, PropertyProps } from "../../domain/entities/Property";
import { Price } from "../../domain/value-objects/Price";
import { Area } from "../../domain/value-objects/Area";
import { Location } from "../../domain/value-objects/Location";

/**
 * Mock property data for development.
 * Image URLs from the Stitch design system.
 */
const mockPropertyData: PropertyProps[] = [
  {
    id: "prop-001",
    title: "Tanah View Laut - Gunungkidul",
    location: Location.of("Gunungkidul", "D.I. Yogyakarta"),
    price: Price.fromRupiah(850_000_000),
    area: Area.fromSquareMeters(2500),
    certificate: "SHM",
    badge: "exclusive",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-002",
    title: "Kavling Premium - Bogor Barat",
    location: Location.of("Bogor", "Jawa Barat"),
    price: Price.fromRupiah(2_000_000_000),
    area: Area.fromSquareMeters(1500),
    certificate: "SHM",
    badge: "broker",
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-003",
    title: "Tanah Dekat Pantai",
    location: Location.of("Bali", "Bali"),
    price: Price.fromRupiah(950_000_000),
    area: Area.fromSquareMeters(3000),
    certificate: "SHM",
    badge: "exclusive",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-004",
    title: "Tanah Strategis Dekat Kota Batu",
    location: Location.of("Batu", "Jawa Timur"),
    price: Price.fromRupiah(1_250_000_000),
    area: Area.fromSquareMeters(1200),
    certificate: "HGB",
    badge: "broker",
    imageUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-005",
    title: "Lahan Perkebunan Produktif",
    location: Location.of("Jember", "Jawa Timur"),
    price: Price.fromRupiah(3_600_000_000),
    area: Area.fromSquareMeters(12000),
    certificate: "HGU",
    badge: null,
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-006",
    title: "Kavling Siap Bangun Canggu",
    location: Location.of("Badung", "Bali"),
    price: Price.fromRupiah(2_750_000_000),
    area: Area.fromSquareMeters(500),
    certificate: "SHM",
    badge: "exclusive",
    imageUrl:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-007",
    title: "Tanah Komersial Pinggir Jalan",
    location: Location.of("Sleman", "D.I. Yogyakarta"),
    price: Price.fromRupiah(1_800_000_000),
    area: Area.fromSquareMeters(800),
    certificate: "HGB",
    badge: "broker",
    imageUrl:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-008",
    title: "Tanah View Gunung Puncak",
    location: Location.of("Bogor", "Jawa Barat"),
    price: Price.fromRupiah(1_100_000_000),
    area: Area.fromSquareMeters(1800),
    certificate: "SHM",
    badge: null,
    imageUrl:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-009",
    title: "Lahan Industri Akses Tol",
    location: Location.of("Karawang", "Jawa Barat"),
    price: Price.fromRupiah(8_500_000_000),
    area: Area.fromSquareMeters(5000),
    certificate: "HGB",
    badge: "broker",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-010",
    title: "Tanah Samping Pantai Lombok",
    location: Location.of("Lombok Tengah", "Nusa Tenggara Barat"),
    price: Price.fromRupiah(1_950_000_000),
    area: Area.fromSquareMeters(2200),
    certificate: "HP",
    badge: "exclusive",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-011",
    title: "Kebun Durian Produktif",
    location: Location.of("Deli Serdang", "Sumatera Utara"),
    price: Price.fromRupiah(2_400_000_000),
    area: Area.fromSquareMeters(7500),
    certificate: "HGU",
    badge: null,
    imageUrl:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&h=600&fit=crop",
    isFavorited: false,
  },
  {
    id: "prop-012",
    title: "Tanah Hunian Dekat Universitas",
    location: Location.of("Depok", "Jawa Barat"),
    price: Price.fromRupiah(980_000_000),
    area: Area.fromSquareMeters(650),
    certificate: "SHM",
    badge: "exclusive",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    isFavorited: false,
  },
];

export const mockProperties: Property[] = mockPropertyData.map((data) =>
  Property.create(data),
);
