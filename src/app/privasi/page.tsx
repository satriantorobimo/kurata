import type { Metadata } from "next";
import { PageHero, PagePlaceholder } from "@/presentation/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Privasi | Kurata",
  description: "Kebijakan privasi Kurata mengenai pengumpulan, penggunaan, dan perlindungan data pribadi Anda.",
};

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero title="Kebijakan Privasi" description="Kebijakan privasi Kurata mengenai pengumpulan, penggunaan, dan perlindungan data pribadi Anda." />
      <PagePlaceholder>Halaman ini sedang dalam pengembangan. Kebijakan privasi lengkap akan segera tersedia.</PagePlaceholder>
    </div>
  );
}
