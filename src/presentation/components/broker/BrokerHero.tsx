import Image from "next/image";
import { ArrowDown, BadgeCheck } from "lucide-react";
import { ButtonLink } from "@/presentation/components/shared/Button";

export function BrokerHero() {
  return (
    <section className="overflow-hidden bg-surface-container-low pt-16 md:pt-20">
      <div className="container-main grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-label-sm font-label-sm text-primary">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Program Mitra Kurata
          </div>
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-on-surface md:text-5xl">Tumbuhkan Bisnis Properti Anda Bersama Kurata</h1>
          <p className="mt-5 max-w-xl text-body-md leading-7 text-on-surface-variant md:text-base">Bergabunglah dengan jaringan broker profesional untuk memasarkan listing secara lebih terarah, transparan, dan terpercaya.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#pendaftaran" className="px-6 py-3">
              Daftar Sebagai Mitra Kurata
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#cara-kerja" variant="outline" className="px-6 py-3">
              Pelajari Program
            </ButtonLink>
          </div>
          <p className="mt-5 text-label-sm text-on-surface-variant">Pendaftaran awal gratis dan tanpa komitmen eksklusif.</p>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-8 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <Image src="/broker.png" alt="Ilustrasi Mitra Kurata" width={1182} height={1182} priority className="relative aspect-square w-full rounded-2xl object-cover shadow-card" />
        </div>
      </div>
    </section>
  );
}
