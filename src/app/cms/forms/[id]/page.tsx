import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsFormDetail } from "@/application/use-cases/cms/GetCmsForms";
import { container } from "@/infrastructure/di/container";
import { FormDetailPage } from "@/presentation/components/cms/FormDetailPage";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsFormDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { canWrite } = await getCmsAccess();

  const form = await new GetCmsFormDetail(container.cmsRepo).execute(id);
  if (!form) notFound();

  return (
    <>
      <Link href="/cms/forms" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke pengajuan
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title={form.fullName} description={form.formType} />
      </div>
      <FormDetailPage form={form} canWrite={canWrite} />
    </>
  );
}