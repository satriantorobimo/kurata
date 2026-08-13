import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsBrokerOptions, GetCmsPropertyDetail, GetCmsPropertyImages } from "@/application/use-cases/cms/GetCmsProperties";
import { GetCmsSalesOptions } from "@/application/use-cases/cms/GetCmsSales";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { PropertyForm } from "@/presentation/components/cms/PropertyForm";
import { PropertyImagesManager } from "@/presentation/components/cms/PropertyImagesManager";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";
import { getCmsAccess } from "../../../access";

export const dynamic = "force-dynamic";

export default async function CmsInvestmentListingEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { canWrite } = await getCmsAccess();
  const [property, images, brokers, sales] = await Promise.all([new GetCmsPropertyDetail(container.cmsRepo).execute(id), new GetCmsPropertyImages(container.cmsRepo).execute(id), new GetCmsBrokerOptions(container.cmsRepo).execute(), new GetCmsSalesOptions(container.cmsRepo).execute()]);
  if (!property || property.landType !== "business_potential") notFound();

  return <>
    <Link href="/cms/investasi/listings" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Kembali ke listing potensi</Link>
    <div className="mt-5"><PageHeader eyebrow="Kurata CMS" title={canWrite ? "Edit listing potensi" : "Detail listing potensi"} description={property.title} actions={<StatusBadge value={property.isPublished ? "published" : property.reviewStatus} />} /></div>
    {canWrite ? <PropertyForm mode="edit" propertyId={id} initial={property} brokers={brokers} sales={sales} landType="business_potential" /> : null}
    <div className="mt-6">{canWrite ? <PropertyImagesManager propertyId={id} images={images} /> : null}</div>
  </>;
}
