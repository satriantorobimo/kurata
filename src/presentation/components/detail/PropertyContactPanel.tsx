import { MessageCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";

import type { PropertyDetailDTO } from "@/application/dto/PropertyDetailDTO";
import { Button, ButtonLink } from "@/presentation/components/shared/Button";

function shouldOptimizeImage(src: string): boolean {
  return src.startsWith("/") || src.startsWith("https://images.unsplash.com/");
}

export function PropertyContactPanel({ property }: { property: PropertyDetailDTO }) {
  return (
    <aside className="rounded-xl border border-border-subtle bg-surface-container-lowest p-5 shadow-card lg:sticky lg:top-24">
      <p className="text-label-sm text-on-surface-variant">Harga penawaran</p>
      <p className="mt-1 text-2xl font-bold text-primary">{property.price}</p>

      <div className="mt-5 border-t border-border-subtle pt-4">
        {property.badge === "exclusive" && property.salesName ? (
          <SalesSection name={property.salesName} phone={property.salesPhone} avatarUrl={property.salesAvatarUrl} />
        ) : property.brokerName ? (
          <BrokerSection name={property.brokerName} city={property.brokerCity} phone={property.brokerPhone} avatarKey={property.brokerAvatarKey} />
        ) : (
          <FallbackSection label={property.contactLabel} />
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 text-label-sm text-on-surface-variant">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        Informasi legal tetap perlu diverifikasi kembali sebelum transaksi.
      </p>
    </aside>
  );
}

function BrokerSection({ name, city, phone, avatarKey }: { name: string; city: string | null; phone: string | null; avatarKey: string | null }) {
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <>
      <p className="text-label-sm font-medium text-on-surface-variant">Tanya Mitra Kurata</p>
      <div className="mt-3 flex items-center gap-3">
        {avatarKey ? (
          <Image src={avatarKey} alt={`Foto ${name}`} width={40} height={40} unoptimized={!shouldOptimizeImage(avatarKey)} className="h-10 w-10 rounded-full border border-border-subtle object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label-sm font-bold text-primary">{initial}</div>
        )}
        <div className="min-w-0">
          <p className="truncate text-label-md font-label-md text-on-surface">{name}</p>
          {city ? <p className="text-label-sm text-on-surface-variant">Mitra Kurata · {city}</p> : <p className="text-label-sm text-on-surface-variant">Mitra Kurata</p>}
        </div>
      </div>
      {phone ? (
        <ButtonLink href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full px-4 py-2.5">
          <MessageCircle className="h-4 w-4" />
          Hubungi via WhatsApp
        </ButtonLink>
      ) : null}
    </>
  );
}

function FallbackSection({ label }: { label: string }) {
  return (
    <>
      <div className="rounded-lg bg-primary/5 p-3">
        <p className="text-label-md font-label-md text-on-surface">{label}</p>
        <p className="mt-1 text-label-sm text-on-surface-variant">Dapatkan informasi, ketersediaan, dan jadwal survei properti.</p>
      </div>
      <Button type="button" disabled className="mt-3 w-full px-4 py-2.5">
        <MessageCircle className="h-4 w-4" />
        Hubungi {label}
      </Button>
    </>
  );
}

function SalesSection({ name, phone, avatarUrl }: { name: string; phone: string | null; avatarUrl: string | null }) {
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <>
      <p className="text-label-sm font-medium text-on-surface-variant">Hubungi:</p>
      <div className="mt-3 flex items-center gap-3">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={`Foto ${name}`} width={40} height={40} unoptimized={!shouldOptimizeImage(avatarUrl)} className="h-10 w-10 rounded-full border border-border-subtle object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-label-sm font-bold text-primary">{initial}</div>
        )}
        <div className="min-w-0">
          <p className="truncate text-label-md font-label-md text-on-surface">{name}</p>
          <p className="text-label-sm text-on-surface-variant">Sales & Marketing</p>
        </div>
      </div>
      {phone ? (
        <ButtonLink href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full px-4 py-2.5">
          <MessageCircle className="h-4 w-4" />
          Chat via WhatsApp
        </ButtonLink>
      ) : null}
    </>
  );
}
