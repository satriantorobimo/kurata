"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/cn";
import { IconButton } from "@/presentation/components/shared/Button";

interface PropertyGalleryProps {
  title: string;
  imageUrls: string[];
}

function shouldOptimizeImage(src: string): boolean {
  return src.startsWith("/") || src.startsWith("https://images.unsplash.com/");
}

export function PropertyGallery({ title, imageUrls }: PropertyGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const allImages = imageUrls.length > 0 ? imageUrls : [];
  const gridImages = allImages.slice(0, 4);

  const open = (index: number) => setSelected(index);
  const close = () => setSelected(null);

  const goNext = useCallback(() => {
    setSelected((prev) => (prev !== null ? (prev + 1) % allImages.length : null));
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    setSelected((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : null));
  }, [allImages.length]);

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selected, goNext, goPrev]);

  if (allImages.length === 0) {
    return (
      <section aria-label={`Galeri ${title}`} className="flex min-h-72 items-center justify-center rounded-xl bg-surface-container-low md:min-h-[31rem]">
        <p className="text-on-surface-variant">Tidak ada foto</p>
      </section>
    );
  }

  return (
    <>
      <section aria-label={`Galeri ${title}`} className="grid gap-3 md:grid-cols-2 md:grid-rows-2">
        <button
          type="button"
          onClick={() => open(0)}
          className="group relative min-h-72 overflow-hidden rounded-xl bg-surface-container-low md:row-span-2 md:min-h-[31rem]"
        >
          <Image
            src={gridImages[0]}
            alt={title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            unoptimized={!shouldOptimizeImage(gridImages[0])}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {gridImages.slice(1, 3).map((image, index) => {
          const imageIndex = index + 1;
          const showOverlay = index === 1 && allImages.length > 3;

          return (
            <button
              key={image}
              type="button"
              onClick={() => open(imageIndex)}
              className="group relative min-h-44 overflow-hidden rounded-xl bg-surface-container-low md:min-h-0"
            >
              <Image
                src={image}
                alt={`${title}, foto ${imageIndex + 1}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                unoptimized={!shouldOptimizeImage(image)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {showOverlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-on-surface/45 text-label-md font-label-md text-on-primary">
                  +{allImages.length - 3} foto
                </div>
              )}
            </button>
          );
        })}
      </section>

      {selected !== null && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-black/90",
            "animate-in fade-in duration-200",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau foto"
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-body-sm text-white/80">
              {selected + 1} / {allImages.length}
            </span>
            <IconButton
              onClick={close}
              className="rounded-lg p-2 transition-colors hover:bg-white/10"
              label="Tutup"
            >
              <X className="h-5 w-5" />
            </IconButton>
          </div>

          <div className="flex flex-1 items-center justify-center px-4">
            {allImages.length > 1 && (
              <IconButton
                onClick={goPrev}
                className="mr-2 shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/10 md:mr-4"
                label="Sebelumnya"
                size="lg"
              >
                <ChevronLeft className="h-7 w-7" />
              </IconButton>
            )}

            <div className="flex max-h-[75vh] max-w-[85vw] items-center justify-center">
              <Image
                src={allImages[selected]}
                alt={`${title}, foto ${selected + 1}`}
                width={1600}
                height={1200}
                unoptimized={!shouldOptimizeImage(allImages[selected])}
                className="max-h-[75vh] max-w-full rounded-lg object-contain"
              />
            </div>

            {allImages.length > 1 && (
              <IconButton
                onClick={goNext}
                className="ml-2 shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/10 md:ml-4"
                label="Selanjutnya"
                size="lg"
              >
                <ChevronRight className="h-7 w-7" />
              </IconButton>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3">
              {allImages.map((image, i) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={cn(
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    i === selected ? "border-white" : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image}
                    alt={`${title}, foto ${i + 1}`}
                    fill
                    sizes="56px"
                    unoptimized={!shouldOptimizeImage(image)}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
