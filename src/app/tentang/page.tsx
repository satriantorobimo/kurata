import type { Metadata } from "next";
import { PageHero, PagePlaceholder } from "@/presentation/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Tentang Kami | Kurata",
  description: "Kurata adalah platform investasi tanah terdepan yang menghubungkan pembeli, broker, dan pengembang dengan transparansi penuh.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero title="Tentang Kami" description="Kurata adalah platform investasi tanah terdepan yang menghubungkan pembeli, broker, dan pengembang dengan transparansi penuh." />
      <PagePlaceholder>Halaman ini sedang dalam pengembangan. Informasi lengkap tentang Kurata akan segera tersedia.</PagePlaceholder>
    </div>
  );
}
