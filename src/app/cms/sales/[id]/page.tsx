import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsSalesDetail } from "@/application/use-cases/cms/GetCmsSales";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SalesDetailPage } from "@/presentation/components/cms/SalesDetailPage";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsSalesDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { canWrite } = await getCmsAccess();

  const sales = await new GetCmsSalesDetail(container.cmsRepo).execute(id);
  if (!sales) notFound();

  return (
    <>
      <Link href="/cms/sales" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke sales
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title={sales.name} description={sales.email} />
      </div>
      <SalesDetailPage sales={sales} canWrite={canWrite} />
    </>
  );
}
