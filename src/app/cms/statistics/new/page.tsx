import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { StatisticForm } from "@/presentation/components/cms/StatisticForm";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsNewStatisticPage() {
  const { canWrite } = await getCmsAccess();
  if (!canWrite) redirect("/cms/statistics");

  return (
    <>
      <Link href="/cms/statistics" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke statistik
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Buat statistik" description="Tambahkan angka statistik baru untuk beranda." />
      </div>
      <StatisticForm mode="create" />
    </>
  );
}