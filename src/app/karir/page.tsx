import type { Metadata } from "next";
import { PageHero, PagePlaceholder } from "@/presentation/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Karir | Kurata",
  description: "Bergabunglah dengan tim Kurata dan bangun masa depan investasi tanah bersama kami.",
};

export default function KarirPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero title="Karir" description="Bergabunglah dengan tim Kurata dan bangun masa depan investasi tanah bersama kami." />
      <PagePlaceholder>Halaman ini sedang dalam pengembangan. Lowongan dan informasi karir akan segera tersedia.</PagePlaceholder>
    </div>
  );
}
