import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { GetPropertyDetail } from "@/application/use-cases/GetPropertyDetail";
import { GetRelatedProperties } from "@/application/use-cases/GetRelatedProperties";
import { container } from "@/infrastructure/di/container";
import { Badge } from "@/presentation/components/shared/Badge";
import { PropertyActions } from "@/presentation/components/detail/PropertyActions";
import { PropertyContactPanel } from "@/presentation/components/detail/PropertyContactPanel";
import { PropertyFacts } from "@/presentation/components/detail/PropertyFacts";
import { PropertyGallery } from "@/presentation/components/detail/PropertyGallery";
import { RelatedProperties } from "@/presentation/components/detail/RelatedProperties";

type PageParams = Promise<{ id: string }>;

async function getDetail(id: string) {
  return new GetPropertyDetail(container.propertyRepo).execute(id);
}

export async function generateStaticParams() {
  const ids = await container.propertyRepo.getAllIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getDetail(id);

  if (!property) {
    return { title: "Properti Tidak Ditemukan | Kurata" };
  }

  return {
    title: `${property.title} | Kurata`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: `${property.title} | Kurata`,
      description: property.description.slice(0, 160),
      images: [{ url: property.imageUrls[0], alt: property.title }],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const property = await getDetail(id);
  if (!property) notFound();

  const relatedProperties = await new GetRelatedProperties(container.propertyRepo).execute(id);

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      <div className="container-main py-5">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-label-sm text-on-surface-variant">
          <Link href="/" className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Beranda</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link href="/cari-tanah" className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Cari Tanah</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="max-w-48 truncate text-on-surface" aria-current="page">{property.title}</span>
        </nav>
      </div>

      <main className="container-main pb-16">
        <PropertyGallery title={property.title} imageUrls={property.imageUrls} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-8 border-b border-border-subtle pb-8">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  {property.badge && <div className="mb-3"><Badge variant={property.badge} /></div>}
                  <h1 className="text-3xl font-bold leading-tight text-on-surface md:text-4xl">{property.title}</h1>
                  <div className="mt-3 flex items-center gap-2 text-body-md text-on-surface-variant">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {property.location}
                  </div>
                </div>
                <PropertyActions title={property.title} initialFavorite={property.isFavorited} />
              </div>
              <p className="text-2xl font-bold text-primary md:text-3xl">{property.price}</p>
              <p className="mt-1 text-label-sm text-on-surface-variant">Referensi listing: {property.id}</p>
            </div>

            <div className="space-y-8">
              <PropertyFacts property={property} />

              <section aria-labelledby="description-title" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
                <h2 id="description-title" className="mb-4 text-headline-md font-headline-md text-on-surface">Tentang Properti Ini</h2>
                <p className="leading-7 text-body-md text-on-surface-variant">{property.description}</p>
              </section>

              <section aria-labelledby="location-title" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
                <h2 id="location-title" className="mb-2 text-headline-md font-headline-md text-on-surface">Lokasi dan Akses</h2>
                <p className="mb-5 flex items-start gap-2 text-body-md text-on-surface-variant"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />{property.address}</p>
                <div className="mb-5 flex min-h-44 items-center justify-center rounded-lg bg-surface-container-low text-center text-label-md text-on-surface-variant">Peta lokasi akan tersedia saat integrasi peta diaktifkan.</div>
                <h3 className="mb-3 text-label-md font-label-md text-on-surface">Keunggulan lokasi</h3>
                <ul className="space-y-2">
                  {property.facilities.map((facility) => <li key={facility} className="flex items-center gap-2 text-body-md text-on-surface-variant"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{facility}</li>)}
                </ul>
              </section>
            </div>
          </div>

          <PropertyContactPanel property={property} />
        </div>

        <div className="mt-14">
          <RelatedProperties properties={relatedProperties} />
        </div>
      </main>
    </div>
  );
}
