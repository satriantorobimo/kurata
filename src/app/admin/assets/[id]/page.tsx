import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssetReviewWorkspace } from "@/presentation/components/admin/AssetReviewWorkspace";
import { GetAdminReviewData } from "@/application/use-cases/GetAdminReviewData";
import { container } from "@/infrastructure/di/container";

export const metadata: Metadata = { title: "Review Aset | Kurata Admin" };

export default async function AdminAssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await new GetAdminReviewData(container.adminRepo).execute();
  const asset = data.assets.find((item) => item.id.toLowerCase() === id.toLowerCase());
  if (!asset) notFound();
  return <AssetReviewWorkspace asset={asset} />;
}
