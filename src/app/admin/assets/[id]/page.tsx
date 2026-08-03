import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ADMIN_DEMO_DATA } from "@/application/config/adminDemoData";
import { AssetReviewWorkspace } from "@/presentation/components/admin/AssetReviewWorkspace";

export const metadata: Metadata = { title: "Review Aset | Kurata Admin" };

export default async function AdminAssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = ADMIN_DEMO_DATA.assets.find((item) => item.id === id);
  if (!asset) notFound();
  return <AssetReviewWorkspace asset={asset} />;
}
