import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Search } from "lucide-react";
import { GetBlogArticles } from "@/application/use-cases/GetBlogArticles";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS, isBlogCategory } from "@/domain/entities/BlogArticle";
import { container } from "@/infrastructure/di/container";
import { BlogCard } from "@/presentation/components/blog/BlogCard";

export const metadata: Metadata = { title: "Blog", description: "Panduan, wawasan, dan artikel edukasi seputar tanah, properti, investasi, serta proses pertanahan.", alternates: { canonical: "/blog" } };
export const dynamic = "force-dynamic";

const PER_PAGE = 6;
type SearchParams = { category?: string | string[]; q?: string | string[]; page?: string | string[] };

function singleValue(value: string | string[] | undefined) { return typeof value === "string" ? value : ""; }
function blogHref({ category, query, page }: { category?: string; query?: string; page?: number }) { const params = new URLSearchParams(); if (category) params.set("category", category); if (query) params.set("q", query); if (page && page > 1) params.set("page", String(page)); const suffix = params.toString(); return `/blog${suffix ? `?${suffix}` : ""}`; }

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const rawParams = await searchParams;
  const query = singleValue(rawParams.q).trim();
  const categoryValue = singleValue(rawParams.category);
  const category = isBlogCategory(categoryValue) ? categoryValue : undefined;
  const pageNumber = Math.max(1, Number.parseInt(singleValue(rawParams.page), 10) || 1);
  const allArticles = await new GetBlogArticles(container.blogArticleRepo).execute();
  const featured = allArticles.find((article) => article.isFeatured);
  const filteredArticles = allArticles.filter((article) => {
    const text = `${article.title} ${article.excerpt} ${BLOG_CATEGORY_LABELS[article.category]}`.toLocaleLowerCase("id-ID");
    return (!category || article.category === category) && (!query || text.includes(query.toLocaleLowerCase("id-ID")));
  });
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PER_PAGE));
  const currentPage = Math.min(pageNumber, totalPages);
  const articles = filteredArticles.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const displayFeatured = featured && !category && !query && currentPage === 1;

  return <div className="min-h-screen bg-background"><section className="bg-surface-container-low pb-16 pt-28 md:pb-20 md:pt-36"><div className="container-main"><div className="max-w-2xl"><div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-label-sm font-label-sm text-primary"><BookOpen className="h-4 w-4" aria-hidden="true" />Wawasan Kurata</div><h1 className="mt-5 text-4xl font-bold tracking-tight text-on-surface md:text-5xl">Panduan untuk Memahami Tanah dengan Lebih Baik</h1><p className="mt-5 text-body-md leading-7 text-on-surface-variant md:text-base">Temukan artikel edukasi tentang pencarian tanah, informasi awal properti, investasi, dan langkah yang perlu dipersiapkan sebelum transaksi.</p></div></div></section>
    <section className="container-main py-12 md:py-16" aria-labelledby="blog-articles-title"><form method="get" className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-container-lowest p-4 shadow-card sm:flex-row sm:items-center"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" aria-hidden="true" /><input name="q" type="search" defaultValue={query} placeholder="Cari topik atau artikel" aria-label="Cari topik atau artikel" className="w-full rounded-xl border border-border-subtle bg-surface-container-lowest py-3 pl-11 pr-4 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20" />{category && <input type="hidden" name="category" value={category} />}</div><button type="submit" className="rounded-xl bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90">Cari Artikel</button></form><div className="mt-5 flex flex-wrap gap-2" aria-label="Filter kategori"><Link href={blogHref({ query })} className={`rounded-full px-4 py-2 text-label-sm font-label-sm transition-colors ${!category ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary"}`}>Semua</Link>{BLOG_CATEGORIES.map((item) => <Link key={item} href={blogHref({ category: item, query })} className={`rounded-full px-4 py-2 text-label-sm font-label-sm transition-colors ${category === item ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary"}`}>{BLOG_CATEGORY_LABELS[item]}</Link>)}</div></section>
    {displayFeatured && <section className="container-main pb-8 md:pb-12" aria-labelledby="featured-article-title"><p className="mb-3 text-label-sm font-label-sm uppercase tracking-wider text-primary">Artikel pilihan</p><h2 id="featured-article-title" className="sr-only">Artikel pilihan</h2><BlogCard article={featured} featured /></section>}
    <section className="container-main pb-16 md:pb-24" aria-labelledby="blog-articles-title"><div className="flex items-end justify-between gap-4"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Artikel terbaru</p><h2 id="blog-articles-title" className="mt-2 text-3xl font-bold tracking-tight text-on-surface">{category ? BLOG_CATEGORY_LABELS[category] : "Temukan Wawasan yang Relevan"}</h2></div><p className="text-label-sm text-on-surface-variant">{filteredArticles.length} artikel</p></div>{articles.length > 0 ? <div className="mt-8 grid gap-gutter md:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <BlogCard key={article.slug} article={article} />)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-10 text-center"><h3 className="text-headline-sm font-headline-sm text-on-surface">Artikel belum ditemukan</h3><p className="mt-2 text-body-md text-on-surface-variant">Coba gunakan kata kunci lain atau pilih kategori berbeda.</p><Link href="/blog" className="mt-5 inline-flex text-label-md font-label-md text-primary hover:underline">Tampilkan semua artikel</Link></div>}{totalPages > 1 && <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination artikel"><Link href={blogHref({ category, query, page: currentPage - 1 })} aria-disabled={currentPage === 1} className={`inline-flex items-center gap-1 rounded-lg border border-border-subtle px-4 py-2 text-label-md font-label-md ${currentPage === 1 ? "pointer-events-none opacity-45" : "text-on-surface hover:border-primary hover:text-primary"}`}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Sebelumnya</Link><span className="text-label-sm text-on-surface-variant">Halaman {currentPage} dari {totalPages}</span><Link href={blogHref({ category, query, page: currentPage + 1 })} aria-disabled={currentPage === totalPages} className={`inline-flex items-center gap-1 rounded-lg border border-border-subtle px-4 py-2 text-label-md font-label-md ${currentPage === totalPages ? "pointer-events-none opacity-45" : "text-on-surface hover:border-primary hover:text-primary"}`}>Berikutnya<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></nav>}</section>
  </div>;
}
