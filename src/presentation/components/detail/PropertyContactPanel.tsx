import { CalendarDays, MessageCircle, ShieldCheck } from "lucide-react";
import type { PropertyDetailDTO } from "@/application/dto/PropertyDetailDTO";

export function PropertyContactPanel({ property }: { property: PropertyDetailDTO }) {
  return (
    <aside className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card lg:sticky lg:top-24">
      <p className="mb-1 text-label-sm text-on-surface-variant">Harga penawaran</p>
      <p className="mb-5 text-2xl font-bold text-primary">{property.price}</p>
      <div className="mb-5 rounded-lg bg-primary/5 p-4">
        <p className="text-label-md font-label-md text-on-surface">{property.contactLabel}</p>
        <p className="mt-1 text-label-sm text-on-surface-variant">Dapatkan informasi, ketersediaan, dan jadwal survei properti.</p>
      </div>
      <button type="button" disabled className="mb-3 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-label-md font-label-md text-on-primary opacity-55" aria-describedby="contact-note">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Hubungi {property.contactLabel}
      </button>
      <button type="button" disabled className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 text-label-md font-label-md text-primary opacity-55" aria-describedby="contact-note">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Jadwalkan Survei
      </button>
      <p id="contact-note" className="mt-4 text-label-sm text-on-surface-variant">Kontak langsung akan tersedia saat layanan broker dan autentikasi dihubungkan.</p>
      <div className="mt-5 flex items-start gap-2 border-t border-border-subtle pt-4 text-label-sm text-on-surface-variant">
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        Informasi legal tetap perlu diverifikasi kembali sebelum transaksi.
      </div>
    </aside>
  );
}
