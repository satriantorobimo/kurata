import { PropertyDetail } from "../../domain/entities/PropertyDetail";
import { Property } from "../../domain/entities/Property";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop",
];

const FACILITIES = [
  "Akses jalan kendaraan roda empat",
  "Lingkungan berkembang dan tertata",
  "Dekat fasilitas kebutuhan sehari-hari",
];

export function createMockPropertyDetail(property: Property): PropertyDetail {
  const area = property.area.toNumber();
  const width = Math.max(12, Math.round(Math.sqrt(area * 0.7)));
  const length = Math.max(20, Math.round(area / width));
  const listingType = property.badge === "exclusive" ? "telah diverifikasi oleh tim Kurata" : "dipasarkan melalui jaringan partner Kurata";

  return {
    property,
    description: `${property.title} merupakan pilihan lahan yang ${listingType}. Lokasinya menawarkan akses yang baik untuk rencana hunian, investasi, maupun pengembangan usaha. Informasi pada halaman ini disusun dari data listing dan tetap perlu dikonfirmasi kembali saat survei lokasi.`,
    imageUrls: [property.imageUrl, ...GALLERY_IMAGES.filter((image) => image !== property.imageUrl).slice(0, 3)],
    dimensions: `± ${width} m × ${length} m`,
    zoning: property.certificate === "HGU" ? "Perkebunan / agribisnis" : "Hunian, investasi, atau komersial",
    roadAccess: "Jalan lingkungan ± 5 meter",
    legalStatus: `${property.certificate} tersedia untuk pengecekan dokumen`,
    address: `${property.location.toDisplayString()}, Indonesia`,
    facilities: FACILITIES,
    listedAt: "Diperbarui hari ini",
    contactLabel: property.badge === "broker" ? "Mitra Kurata" : "Tim Kurata",
    brokerName: null,
    brokerCity: null,
    brokerPhone: null,
    brokerAvatarKey: null,
    salesName: null,
    salesPhone: null,
    salesAvatarUrl: null,
  };
}
