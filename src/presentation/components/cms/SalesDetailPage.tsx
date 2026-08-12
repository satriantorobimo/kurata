"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteSalesAction, updateSalesAction } from "@/app/cms/actions";
import type { CmsSalesDetail } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card, CardHeader } from "@/presentation/components/cms/Card";
import { TextInput } from "@/presentation/components/cms/Field";
import { ImageUpload } from "@/presentation/components/cms/ImageUpload";
import { Notice } from "@/presentation/components/cms/Notice";
import { ConfirmDialog } from "@/presentation/components/cms/ConfirmDialog";

export function SalesDetailPage({ sales, canWrite }: { sales: CmsSalesDetail; canWrite: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteOpen, setDeleteOpen] = useState(false);

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateSalesAction(sales.id, {
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
      });
      if (result.ok) {
        setNotice(result.message ?? "Sales diperbarui.");
        setFieldErrors({});
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat memperbarui sales.");
      }
    });
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteSalesAction(sales.id);
      setDeleteOpen(false);
      setNotice(result.message ?? "Sales dihapus.");
      if (result.ok) {
        router.push("/cms/sales");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") || notice.includes("diperbarui") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <CardHeader title="Data sales" description="Informasi kontak dan lokasi penugasan." />
        <form action={submit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUpload name="avatarUrl" label="Foto profil" currentUrl={sales.avatarUrl ?? ""} disabled={!canWrite} hint={canWrite ? "Pilih & unggah foto baru" : undefined} />
            </div>
            <TextInput id="name" name="name" label="Nama lengkap" required disabled={!canWrite} defaultValue={sales.name} error={fieldErrors.name} />
            <TextInput id="email" name="email" label="Email" type="email" required disabled={!canWrite} defaultValue={sales.email} error={fieldErrors.email} />
            <TextInput id="phone" name="phone" label="Telepon" type="tel" required disabled={!canWrite} defaultValue={sales.phone} error={fieldErrors.phone} />
            <TextInput id="location" name="location" label="Lokasi" required disabled={!canWrite} defaultValue={sales.location} error={fieldErrors.location} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-label-sm text-on-surface-variant">
              Dibuat {sales.createdAt} {sales.updatedAt !== sales.createdAt ? `· diperbarui ${sales.updatedAt}` : ""}
            </p>
            <div className="flex gap-3">
              {canWrite ? (
                <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
                  {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  Simpan
                </button>
              ) : null}
            </div>
          </div>
        </form>
      </Card>

      {canWrite ? (
        <div className="flex justify-end">
          <button type="button" onClick={() => setDeleteOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-error/30 px-4 py-2.5 text-label-md font-label-md text-error transition-colors hover:bg-error-container">
            <Trash2 className="h-4 w-4" />
            Hapus sales
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus sales?"
        description={`Seluruh data ${sales.name} (${sales.email}) akan dihapus permanen.`}
        confirmLabel="Hapus"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
