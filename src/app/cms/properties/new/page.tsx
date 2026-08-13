import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsBrokerOptions } from "@/application/use-cases/cms/GetCmsProperties";
import { GetCmsSalesOptions } from "@/application/use-cases/cms/GetCmsSales";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { PropertyForm } from "@/presentation/components/cms/PropertyForm";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsNewPropertyPage() {
  const { canWrite } = await getCmsAccess();
  if (!canWrite) redirect("/cms/properties");

  const [brokers, sales] = await Promise.all([
    new GetCmsBrokerOptions(container.cmsRepo).execute(),
    new GetCmsSalesOptions(container.cmsRepo).execute(),
  ]);

  return (
    <>
      <Link href="/cms/properties" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar aset
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title="Tambah aset" description="Buat listing tanah baru untuk ditayangkan di platform Kurata." />
      </div>
      <PropertyForm mode="create" brokers={brokers} sales={sales} landType="common" />
    </>
  );
}
