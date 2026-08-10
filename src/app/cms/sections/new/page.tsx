import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { SectionForm } from "@/presentation/components/cms/SectionForm";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsNewSectionPage() {
  const { canWrite } = await getCmsAccess();
  if (!canWrite) redirect("/cms/sections");

  return (
    <>
      <Link href="/cms/sections" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke segmen
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Buat segmen konten" description="Tentukan identitas unik dan isi JSON segmen baru." />
      </div>
      <SectionForm mode="create" />
    </>
  );
}