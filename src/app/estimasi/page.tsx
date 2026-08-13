import type { Metadata } from "next";
import { PageHero, PagePlaceholder } from "@/presentation/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Estimasi Harga | Kurata",
  description: "Estimasi harga tanah berdasarkan data pasar dan analisis lokasi.",
};

export default function EstimasiPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero title="Estimasi Harga" description="Estimasi harga tanah berdasarkan data pasar dan analisis lokasi." />
      <PagePlaceholder>Halaman ini sedang dalam pengembangan. Fitur estimasi harga akan segera tersedia.</PagePlaceholder>
    </div>
  );
}
