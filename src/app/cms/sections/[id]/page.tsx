import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsSectionDetail } from "@/application/use-cases/cms/GetCmsContent";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SectionForm } from "@/presentation/components/cms/SectionForm";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsEditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { canWrite } = await getCmsAccess();

  const section = await new GetCmsSectionDetail(container.cmsRepo).execute(id);
  if (!section) notFound();

  return (
    <>
      <Link href="/cms/sections" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke segmen
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Edit segmen konten" description={section.section} />
      </div>
      {canWrite ? <SectionForm mode="edit" id={section.id} initial={section} /> : <p>Anda tidak memiliki izin menulis.</p>}
    </>
  );
}