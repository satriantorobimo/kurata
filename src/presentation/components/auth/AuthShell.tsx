import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const BENEFITS = [
  "Simpan properti yang menarik",
  "Kelola kebutuhan tanah Anda",
  "Terhubung dengan ekosistem Kurata",
];

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-surface-container-low px-4 pb-12 pt-24 sm:px-6 md:pb-16 md:pt-28">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden min-h-170 overflow-hidden bg-primary lg:block">
          <Image src="/eksklusif.png" alt="Pemandangan properti dalam ekosistem Kurata" fill priority sizes="(min-width: 1024px) 42vw, 0px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-on-primary">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-on-primary/15"><ShieldCheck className="h-6 w-6 text-on-primary-container" aria-hidden="true" /></div>
            <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-primary-container">Akun Kurata</p>
            <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight">Satu akun untuk kebutuhan pertanahan Anda</h2>
            <ul className="mt-7 space-y-3">{BENEFITS.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-body-md text-on-primary/85"><CheckCircle2 className="h-4 w-4 shrink-0 text-on-primary-container" aria-hidden="true" />{benefit}</li>)}</ul>
          </div>
        </aside>

        <section className="flex min-h-150 items-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 text-label-md font-label-md text-primary">
              <Image src="/logo.png" alt="Kurata" width={44} height={44} className="rounded-full" />
              Kurata
            </Link>
            <p className="mt-8 text-label-sm font-label-sm uppercase tracking-wider text-primary">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">{title}</h1>
            <p className="mt-3 text-body-md leading-6 text-on-surface-variant">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
