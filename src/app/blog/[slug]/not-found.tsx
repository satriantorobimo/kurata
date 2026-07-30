import Link from "next/link";

export default function BlogArticleNotFound() {
  return <div className="container-main flex min-h-100 flex-col items-center justify-center pt-20 text-center"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">404</p><h1 className="mt-3 text-3xl font-bold text-on-surface">Artikel Tidak Ditemukan</h1><p className="mt-3 max-w-md text-body-md leading-6 text-on-surface-variant">Artikel yang Anda cari mungkin telah dipindahkan atau belum tersedia.</p><Link href="/blog" className="mt-7 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary">Kembali ke Blog</Link></div>;
}
