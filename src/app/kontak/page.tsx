import type { Metadata } from "next";
import { PageHero, PagePlaceholder } from "@/presentation/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Kontak | Kurata",
  description: "Hubungi tim Kurata untuk pertanyaan, bantuan, atau kerja sama.",
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero title="Kontak" description="Hubungi tim Kurata untuk pertanyaan, bantuan, atau kerja sama." />
      <PagePlaceholder>Halaman ini sedang dalam pengembangan. Informasi kontak lengkap akan segera tersedia.</PagePlaceholder>
    </div>
  );
}
