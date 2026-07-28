"use client";

import { Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface PropertyActionsProps {
  title: string;
  initialFavorite: boolean;
}

export function PropertyActions({ title, initialFavorite }: PropertyActionsProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [shareMessage, setShareMessage] = useState("");

  async function share() {
    const shareData = { title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Tautan berhasil disalin");
    } catch {
      setShareMessage("Tautan belum dapat dibagikan");
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <button type="button" onClick={() => setIsFavorite((value) => !value)} className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-container-lowest transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", isFavorite ? "text-error" : "text-on-surface")} aria-label={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}>
        <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
      </button>
      <button type="button" onClick={share} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-container-lowest text-on-surface transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Bagikan properti">
        <Share2 className="h-5 w-5" aria-hidden="true" />
      </button>
      {shareMessage && <span className="absolute right-0 top-12 w-48 rounded-lg bg-inverse-surface px-3 py-2 text-center text-label-sm text-inverse-on-surface" role="status">{shareMessage}</span>}
    </div>
  );
}
