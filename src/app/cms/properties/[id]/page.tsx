import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetCmsBrokerOptions, GetCmsPropertyDetail, GetCmsPropertyImages } from "@/application/use-cases/cms/GetCmsProperties";
import { GetCmsSalesOptions } from "@/application/use-cases/cms/GetCmsSales";
import type { CmsPropertyDetail, CmsPropertyImage } from "@/infrastructure/repositories/PostgresCmsRepository";
import { container } from "@/infrastructure/di/container";
import { PageHeader } from "@/presentation/components/cms/PageHeader";
import { PropertyForm } from "@/presentation/components/cms/PropertyForm";
import { PropertyImagesManager } from "@/presentation/components/cms/PropertyImagesManager";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";
import { formatRupiah } from "@/presentation/components/cms/format";
import { getCmsAccess } from "../../access";

export const dynamic = "force-dynamic";

export default async function CmsPropertyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { canWrite } = await getCmsAccess();

  const [property, images, brokers, sales] = await Promise.all([
    new GetCmsPropertyDetail(container.cmsRepo).execute(id),
    new GetCmsPropertyImages(container.cmsRepo).execute(id),
    new GetCmsBrokerOptions(container.cmsRepo).execute(),
    new GetCmsSalesOptions(container.cmsRepo).execute(),
  ]);

  if (!property) notFound();

  return (
    <>
      <Link href="/cms/properties" className="inline-flex items-center gap-2 text-label-md font-medium text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar aset
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow="Kurata CMS" title={canWrite ? "Edit aset" : "Detail aset"} description={property.title} actions={<StatusBadge value={property.isPublished ? "published" : property.reviewStatus} />} />
      </div>
      {canWrite ? <PropertyForm mode="edit" propertyId={id} initial={property} brokers={brokers} sales={sales} /> : <ReadOnlyPropertyDetail property={property} />}
      <div className="mt-6">{canWrite ? <PropertyImagesManager propertyId={id} images={images} /> : <ReadOnlyImages images={images} />}</div>
    </>
  );
}

function ReadOnlyPropertyDetail({ property }: { property: CmsPropertyDetail }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Lokasi", value: `${property.city}, ${property.province}` },
    { label: "Harga", value: formatRupiah(property.priceAmount) },
    { label: "Luas", value: `${property.areaSqm.toLocaleString("id-ID")} m²` },
    { label: "Sertifikat", value: property.certificate },
    { label: "Badge", value: property.badge ?? "-" },
    { label: "Ditayangkan oleh", value: property.listedByName ?? "Kurata" },
  ];

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-label-sm text-on-surface-variant">{row.label}</p>
            <p className="mt-1 text-label-md font-medium text-on-surface">{row.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
        Anda masuk sebagai mode tampilan. Hubungi Master Admin untuk mengubah data aset.
      </p>
    </div>
  );
}

function ReadOnlyImages({ images }: { images: CmsPropertyImage[] }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.length === 0 ? (
          <p className="col-span-full rounded-xl bg-surface-container-low px-4 py-6 text-center text-body-md text-on-surface-variant">Belum ada foto galeri.</p>
        ) : (
          images.map((image, index) => (
            <figure key={image.id} className="overflow-hidden rounded-xl border border-border-subtle bg-surface-container-high">
              <div className="aspect-[4/3] w-full bg-surface-container-high bg-cover bg-center" style={{ backgroundImage: `url(${image.imageUrl})` }} />
              <figcaption className="px-2.5 py-1.5 text-label-sm text-on-surface-variant">Foto {index + 1}</figcaption>
            </figure>
          ))
        )}
      </div>
    </div>
  );
}