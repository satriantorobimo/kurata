"use client";
/* eslint-disable @next/next/no-img-element -- blob URL previews and dynamic uploaded images don't get Next.js Image optimization */

import { useRef, useState, useTransition } from "react";
import { ImagePlus, LoaderCircle, UploadCloud, X } from "lucide-react";

import { uploadPropertyImageAction } from "@/app/cms/upload-action";
import { cn } from "@/lib/cn";

interface ImageUploadProps {
  name: string;
  currentUrl?: string;
  label: string;
  required?: boolean;
  hint?: string;
  disabled?: boolean;
  maxCount?: number;
  currentCount?: number;
  onUrlChange?: (url: string) => void;
}

export function ImageUpload({ name, currentUrl, label, required, hint, disabled, maxCount, currentCount = 0, onUrlChange }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [uploading, startUpload] = useTransition();

  const displayUrl = uploadedUrl ?? currentUrl ?? undefined;
  const atLimit = typeof maxCount === "number" && currentCount >= maxCount;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.item(0) ?? null;
    if (!selected) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selected);
    setUploadedUrl(null);
    setError("");
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const upload = () => {
    if (!file) return;

    const data = new FormData();
    data.set("file", file);

    startUpload(async () => {
      try {
        const result = await uploadPropertyImageAction(data);
        if (result.ok && result.url) {
          setUploadedUrl(result.url);
          setFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          onUrlChange?.(result.url);
        } else {
          setError(result.error ?? "Gagal mengunggah.");
        }
      } catch {
        setError("Gagal terhubung ke server.");
      }
    });
  };

  const clearFile = () => {
    setFile(null);
    setUploadedUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const rootClass = cn(
    "relative flex flex-col gap-2",
    disabled && "pointer-events-none opacity-60",
  );

  return (
    <div className={rootClass}>
      <span className="text-label-md font-label-md text-on-surface">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </span>

      <input type="hidden" name={name} value={uploadedUrl ?? currentUrl ?? ""} />

      {displayUrl ? (
        <div className="group relative overflow-hidden rounded-xl border border-border-subtle">
          <img src={displayUrl} alt={label} className="aspect-[16/9] w-full object-cover bg-surface-container-high" />
          {!disabled ? (
            <button type="button" onClick={clearFile} className="absolute right-3 top-3 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-label="Hapus gambar">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : previewUrl ? (
        <div className="group relative overflow-hidden rounded-xl border border-border-subtle">
          <img src={previewUrl} alt={`Pratinjau ${label}`} className="aspect-[16/9] w-full object-cover bg-surface-container-high" />
          <button type="button" onClick={clearFile} className="absolute right-3 top-3 rounded-lg bg-black/60 p-1.5 text-white" aria-label="Batal">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <button type="button" onClick={upload} disabled={uploading} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-label-md font-label-md text-on-primary shadow-lg transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
              {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {uploading ? "Mengunggah..." : "Unggah gambar ini"}
            </button>
          </div>
        </div>
      ) : atLimit ? (
        <p className="rounded-xl border border-border-subtle bg-surface-container-low px-4 py-6 text-center text-body-md text-on-surface-variant">Maksimal {maxCount} foto galeri.</p>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle bg-surface-container-lowest px-4 py-8 text-on-surface-variant transition-colors hover:border-primary hover:text-primary">
          <ImagePlus className="h-7 w-7" />
          <span className="text-body-md">Klik untuk memilih gambar</span>
          {hint ? <span className="text-label-sm">{hint}</span> : null}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleFileChange} disabled={disabled || atLimit} className="sr-only" />
        </label>
      )}

      {error ? (
        <p className="text-label-sm text-error" role="alert">{error}</p>
      ) : null}
    </div>
  );
}
