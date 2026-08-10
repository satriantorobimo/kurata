import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsStatisticDetail } from "@/application/use-cases/cms/GetCmsContent";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { StatisticForm } from "@/presentation/components/cms/StatisticForm";
import { getCmsAccess } from "../../../access";

export const dynamic = "force-dynamic";

export default async function CmsEditStatisticPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { canWrite } = await getCmsAccess();

  const statistic = await new GetCmsStatisticDetail(container.cmsRepo).execute(id);
  if (!statistic) notFound();

  return (
    <>
      <Link href="/cms/statistics" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke statistik
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Edit statistik" description={statistic.label} />
      </div>
      {canWrite ? <StatisticForm mode="edit" id={statistic.id} initial={statistic} /> : <p>Anda tidak memiliki izin menulis.</p>}
    </>
  );
}