"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { addPropertyImageAction, deletePropertyImageAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsPropertyImage } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card } from "@/presentation/components/cms/Card";
import { Notice } from "@/presentation/components/cms/Notice";
import { ConfirmDialog } from "@/presentation/components/cms/ConfirmDialog";
import { ImageUpload } from "@/presentation/components/cms/ImageUpload";

const MAX_GALLERY = 3;

export function PropertyImagesManager({ propertyId, images }: { propertyId: string; images: CmsPropertyImage[] }) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CmsPropertyImage | null>(null);
  const [, startTransition] = useTransition();

  const currentCount = images.length;

  const handleUrlChange = (url: string) => {
    startTransition(async () => {
      const result: CmsActionResult = await addPropertyImageAction(propertyId, url);
      setNotice(result.message ?? "Selesai.");
      router.refresh();
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result: CmsActionResult = await deletePropertyImageAction(deleteTarget.id);
      setDeleteTarget(null);
      setNotice(result.message ?? "Selesai.");
      router.refresh();
    });
  };

  return (
    <Card>
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}
      <div className="text-headline-sm font-headline-sm text-on-surface">Galeri foto</div>
      <p className="mt-1 text-body-md text-on-surface-variant">
        Maksimal {MAX_GALLERY} foto galeri ({currentCount} dari {MAX_GALLERY}). Foto utama diunggah terpisah.
      </p>

      <div className="mt-5">
        <ImageUpload
          name="imageUrl"
          label="Tambah foto galeri"
          hint="Pilih gambar, klik Unggah — otomatis tersimpan"
          maxCount={MAX_GALLERY}
          currentCount={currentCount}
          onUrlChange={handleUrlChange}
        />
      </div>

      {currentCount > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <figure key={image.id} className="group relative overflow-hidden rounded-xl border border-border-subtle bg-surface-container-high">
              <button type="button" onClick={() => setDeleteTarget(image)} aria-label="Hapus foto" className="absolute right-2 top-2 z-10 rounded-lg bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="aspect-[4/3] w-full bg-surface-container-high bg-cover bg-center" style={{ backgroundImage: `url(${image.imageUrl})` }} />
              <figcaption className="px-2.5 py-1.5 text-label-sm text-on-surface-variant">Foto {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-surface-container-low px-4 py-6 text-center text-body-md text-on-surface-variant">Belum ada foto galeri.</p>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus foto?"
        description={deleteTarget ? "Foto ini akan dihapus dari galeri aset." : undefined}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Card>
  );
}
