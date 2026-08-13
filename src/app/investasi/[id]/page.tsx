import type { Metadata } from "next";

import { GetPropertyDetail } from "@/application/use-cases/GetPropertyDetail";
import { container } from "@/infrastructure/di/container";
import { PropertyDetailView } from "@/app/cari-tanah/[id]/page";

type PageParams = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { id } = await params;
  const property = await new GetPropertyDetail(container.propertyRepo).execute(id, "business_potential");
  if (!property) return { title: "Potensi Lahan Tidak Ditemukan | Kurata" };

  return {
    title: `${property.title} | Potensi Lahan Kurata`,
    description: property.description.slice(0, 160),
    openGraph: { title: property.title, description: property.description.slice(0, 160), images: [{ url: property.imageUrls[0], alt: property.title }] },
    alternates: { canonical: `/investasi/${id}` },
  };
}

export default async function InvestmentListingDetailPage({ params }: { params: PageParams }) {
  const { id } = await params;
  return <PropertyDetailView id={id} landType="business_potential" catalogPath="/investasi" catalogName="Potensi Lahan" />;
}
