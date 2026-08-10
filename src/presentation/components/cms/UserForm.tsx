"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { createUserAction, type CmsActionResult } from "@/app/cms/actions";
import { Card } from "@/presentation/components/cms/Card";
import { Checkbox, SelectInput, TextInput } from "@/presentation/components/cms/Field";
import { Notice } from "@/presentation/components/cms/Notice";

const ROLE_OPTIONS = [
  { value: "user", label: "Pengguna" },
  { value: "broker", label: "Mitra Kurata" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Master Admin" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Aktif" },
  { value: "suspended", label: "Ditangguhkan" },
  { value: "archived", label: "Diarsipkan" },
];

export function UserForm({ canWrite }: { canWrite: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result: CmsActionResult = await createUserAction({
        email: String(formData.get("email") ?? "").trim(),
        fullName: String(formData.get("fullName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim() || null,
        role: String(formData.get("role") ?? "user") as "user" | "broker" | "admin" | "super_admin",
        status: String(formData.get("status") ?? "active") as "active" | "suspended" | "archived",
        password: String(formData.get("password") ?? ""),
        marketingConsent: formData.get("marketingConsent") === "on",
      });
      if (result.ok) {
        setNotice(result.message ?? "Pengguna berhasil dibuat.");
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat membuat pengguna.");
      }
    });
  };

  return (
    <form action={submit} className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Identitas akun</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextInput id="fullName" name="fullName" label="Nama lengkap" required disabled={!canWrite} error={fieldErrors.fullName} placeholder="Contoh: Budi Santoso" />
          <TextInput id="email" name="email" label="Email" type="email" required disabled={!canWrite} error={fieldErrors.email} placeholder="nama@email.com" />
          <TextInput id="phone" name="phone" label="Telepon (opsional)" type="tel" disabled={!canWrite} error={fieldErrors.phone} placeholder="08xxxxxxxxxx" />
          <TextInput id="password" name="password" label="Password" type="password" required disabled={!canWrite} error={fieldErrors.password} hint="Minimal 8 karakter dengan huruf dan angka." autoComplete="new-password" />
          <SelectInput id="role" name="role" label="Peran" required disabled={!canWrite} defaultValue="user" options={ROLE_OPTIONS} error={fieldErrors.role} />
          <SelectInput id="status" name="status" label="Status akun" required disabled={!canWrite} defaultValue="active" options={STATUS_OPTIONS} error={fieldErrors.status} />
        </div>
        <div className="mt-5">
          <Checkbox id="marketingConsent" name="marketingConsent" label="Menyetujui menerima komunikasi pemasaran" disabled={!canWrite} />
        </div>
      </Card>

      {canWrite ? (
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-border-subtle px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
            Batal
          </button>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {pending ? "Menyimpan..." : "Buat pengguna"}
          </button>
        </div>
      ) : null}
    </form>
  );
}