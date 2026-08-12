"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { createSalesAction, type CmsActionResult } from "@/app/cms/actions";
import { Card } from "@/presentation/components/cms/Card";
import { TextInput } from "@/presentation/components/cms/Field";
import { ImageUpload } from "@/presentation/components/cms/ImageUpload";
import { Notice } from "@/presentation/components/cms/Notice";

export function SalesForm({ canWrite }: { canWrite: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result: CmsActionResult = await createSalesAction({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
      });
      if (result.ok) {
        setNotice(result.message ?? "Sales berhasil dibuat.");
        router.push("/cms/sales");
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat membuat sales.");
      }
    });
  };

  return (
    <form action={submit} className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Data sales</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUpload name="avatarUrl" label="Foto profil" currentUrl="" disabled={!canWrite} hint="Pilih & unggah foto. Maks 5 MB, format JPG/PNG/WebP/AVIF." />
          </div>
          <TextInput id="name" name="name" label="Nama lengkap" required disabled={!canWrite} error={fieldErrors.name} placeholder="Contoh: Budi Santoso" />
          <TextInput id="email" name="email" label="Email" type="email" required disabled={!canWrite} error={fieldErrors.email} placeholder="nama@email.com" />
          <TextInput id="phone" name="phone" label="Telepon" type="tel" required disabled={!canWrite} error={fieldErrors.phone} placeholder="08xxxxxxxxxx" hint="9–16 digit angka" />
          <TextInput id="location" name="location" label="Lokasi" required disabled={!canWrite} error={fieldErrors.location} placeholder="Contoh: Jakarta" />
        </div>
      </Card>

      {canWrite ? (
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-border-subtle px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
            Batal
          </button>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {pending ? "Menyimpan..." : "Buat sales"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
