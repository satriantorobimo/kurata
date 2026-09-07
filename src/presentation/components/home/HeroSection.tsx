"use client";

import { FormEvent, type TouchEvent, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeroSlide {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    desktopSrc: "/desktop-1.jpeg",
    mobileSrc: "/mobile-1.jpeg",
    alt: "Banner Kurata pertama",
  },
  {
    desktopSrc: "/desktop-2.jpeg",
    mobileSrc: "/mobile-2.jpeg",
    alt: "Banner Kurata kedua",
  },
];

const SEARCH_TABS = [
  { id: "all", label: "Semua Tanah", badge: undefined },
  { id: "exclusive", label: "Exclusive Kurata", badge: "exclusive" },
  { id: "broker", label: "Mitra Kurata", badge: "broker" },
] as const;

type SearchTabId = (typeof SEARCH_TABS)[number]["id"];

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTabId>("all");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1 || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [activeSlide, isPaused]);

  function moveSlide(direction: 1 | -1) {
    setActiveSlide((current) => {
      const next = current + direction;
      if (next < 0) return HERO_SLIDES.length - 1;
      return next % HERO_SLIDES.length;
    });
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    if (touchEndX !== undefined && Math.abs(touchEndX - touchStartX.current) > 48) {
      moveSlide(touchEndX < touchStartX.current ? 1 : -1);
    }

    touchStartX.current = null;
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const normalizedQuery = searchQuery.trim();
    const selectedTab = SEARCH_TABS.find((tab) => tab.id === activeTab);

    if (normalizedQuery) params.set("q", normalizedQuery);
    if (selectedTab?.badge) params.set("badge", selectedTab.badge);

    const suffix = params.toString();
    router.push(`/cari-tanah${suffix ? `?${suffix}` : ""}`);
  }

  return (
    <section className="relative w-full pb-0">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container-lowest md:aspect-[8/3]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {HERO_SLIDES.map((item, index) => (
          <div
            key={item.desktopSrc}
            className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-in-out ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={index !== activeSlide}
          >
            <picture className="block size-full">
              <source media="(max-width: 767px)" srcSet={item.mobileSrc} />
              <Image
                src={item.desktopSrc}
                alt={item.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover motion-safe:transition-transform motion-safe:duration-[6000ms] motion-safe:ease-out ${index === activeSlide ? "scale-105" : "scale-100"}`}
              />
            </picture>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-on-surface/5 via-transparent to-on-surface/45" aria-hidden="true" />

        {HERO_SLIDES.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label="Gambar sebelumnya"
              className="absolute left-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface shadow-md transition-colors hover:bg-surface-container-lowest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:left-8"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              aria-label="Gambar berikutnya"
              className="absolute right-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface shadow-md transition-colors hover:bg-surface-container-lowest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:right-8"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {HERO_SLIDES.map((item, index) => (
                <button
                  key={item.desktopSrc}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Tampilkan gambar ${index + 1}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  className={`h-2 rounded-full transition-all ${index === activeSlide ? "w-7 bg-surface-container-lowest" : "w-2 bg-surface-container-lowest/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="container-main relative z-10 -mt-24 md:-mt-28">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/60 bg-white/35 p-5 shadow-[0_16px_40px_rgba(24,55,35,0.18)] backdrop-blur-xl sm:p-7">
          <h1 className="text-center text-2xl font-bold leading-tight tracking-tight text-on-surface md:text-3xl">
            Ekosistem Pertanahan Terpercaya
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-center text-body-md leading-6 text-on-surface-variant md:text-base">
            Semua kebutuhan pertanahan, dari pencarian hingga transaksi, dalam
            satu platform digital yang aman, transparan, dan profesional.
          </p>

          <div className="mt-5 flex justify-center border-b border-border-subtle" role="tablist" aria-label="Kategori pencarian">
            {SEARCH_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-4 py-3 text-label-md font-label-md transition-colors sm:px-6 ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:border-primary/40 hover:text-primary"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-2 rounded-xl border border-white/75 bg-white/80 p-2 shadow-md backdrop-blur-md sm:flex-row sm:items-center">
            <Search className="ml-2 h-5 w-5 shrink-0 text-outline sm:ml-3" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari kota, kabupaten, provinsi, atau kata kunci"
              aria-label="Cari kota, kabupaten, provinsi, atau kata kunci"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-body-md text-on-surface outline-none placeholder:text-outline-variant sm:py-3"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Cari
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
