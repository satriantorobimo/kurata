import Link from "next/link";

import { ButtonLink } from "@/presentation/components/shared/Button";

export default function NotFound() {
  return <main className="flex min-h-dvh items-center bg-background px-6 pt-16"><div className="mx-auto max-w-lg text-center"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">404</p><h1 className="mt-3 text-3xl font-bold text-on-surface">Halaman tidak ditemukan</h1><p className="mt-3 text-body-md leading-6 text-on-surface-variant">Tautan mungkin sudah berubah atau halaman ini tidak tersedia.</p><ButtonLink href="/" className="mt-7 px-6 py-3">Kembali ke Beranda</ButtonLink><Link href="/bantuan" className="mt-4 block text-label-md font-label-md text-primary hover:underline">Butuh bantuan?</Link></div></main>;
}
