import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <div className="flex min-h-screen items-center bg-background px-6 pt-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="mb-3 text-label-sm font-label-sm uppercase tracking-wider text-primary">404</p>
        <h1 className="mb-3 text-3xl font-bold text-on-surface">Properti tidak ditemukan</h1>
        <p className="mb-7 text-body-md text-on-surface-variant">Listing ini mungkin sudah tidak tersedia atau tautannya tidak lagi valid.</p>
        <Link href="/cari-tanah" className="inline-flex rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Kembali ke Cari Tanah</Link>
      </div>
    </div>
  );
}
