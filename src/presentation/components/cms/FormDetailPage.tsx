"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { updateFormSubmissionAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsForm } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card, CardHeader } from "@/presentation/components/cms/Card";
import { Checkbox, SelectInput, TextInput } from "@/presentation/components/cms/Field";
import { Notice } from "@/presentation/components/cms/Notice";
import { StatusBadge } from "@/presentation/components/cms/StatusBadge";

const STATUS_OPTIONS = [
  { value: "pending", label: "Menunggu" },
  { value: "under_review", label: "Ditinjau" },
  { value: "changes_requested", label: "Perlu perbaikan" },
  { value: "rejected", label: "Ditolak" },
  { value: "published", label: "Disetujui" },
];

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function FormDetailPage({ form, canWrite }: { form: CmsForm; canWrite: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [payloadText, setPayloadText] = useState(() => formatJson(form.payload));
  const [payloadError, setPayloadError] = useState("");

  const submit = (formData: FormData) => {
    setPayloadError("");
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(payloadText);
      if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    } catch {
      setPayloadError("Isi payload bukan objek JSON yang valid.");
      return;
    }

    const input = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || null,
      payload: parsed,
      acceptedTerms: formData.get("acceptedTerms") === "on",
      reviewStatus: String(formData.get("reviewStatus") ?? "pending"),
      reviewerNotes: String(formData.get("reviewerNotes") ?? "").trim() || null,
    };

    startTransition(async () => {
      const result: CmsActionResult = await updateFormSubmissionAction(form.id, input);
      if (result.ok) {
        setNotice(result.message ?? "Pengajuan diperbarui.");
        setFieldErrors({});
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat memperbarui pengajuan.");
      }
    });
  };

  return (
    <form action={submit} className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <CardHeader title="Identitas pengirim" action={<StatusBadge value={form.formType} />} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput id="fullName" name="fullName" label="Nama lengkap" required disabled={!canWrite} defaultValue={form.fullName} error={fieldErrors.fullName} />
          <TextInput id="email" name="email" label="Email" required disabled={!canWrite} defaultValue={form.email} error={fieldErrors.email} />
          <TextInput id="phone" name="phone" label="Telepon" disabled={!canWrite} defaultValue={form.phone ?? ""} error={fieldErrors.phone} />
          <SelectInput id="reviewStatus" name="reviewStatus" label="Status" required disabled={!canWrite} defaultValue={form.reviewStatus} options={STATUS_OPTIONS} error={fieldErrors.reviewStatus} />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Checkbox id="acceptedTerms" name="acceptedTerms" label="Menyetujui syarat & ketentuan" disabled={!canWrite} defaultValue={form.acceptedTerms} />
          <div className="text-label-sm text-on-surface-variant">Dikirim: {form.createdAt}</div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Data kuisioner (payload)" description="Isi jawaban tambahan dari pengunjung. Simpan dalam bentuk objek JSON." />
        <textarea value={payloadText} onChange={(event) => setPayloadText(event.target.value)} disabled={!canWrite} rows={12} spellCheck={false} aria-label="Payload JSON" aria-invalid={Boolean(payloadError)} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-4 py-3 font-mono text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error disabled:cursor-not-allowed disabled:bg-surface-container-low" />
        {payloadError ? <p className="mt-1.5 text-label-sm text-error" role="alert">{payloadError}</p> : null}
      </Card>

      <Card>
        <CardHeader title="Catatan peninjau" />
        <textarea name="reviewerNotes" defaultValue={form.reviewerNotes ?? ""} disabled={!canWrite} rows={3} aria-label="Catatan peninjau" className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container-low" />
      </Card>

      {canWrite ? (
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.push("/cms/forms")} className="rounded-lg border border-border-subtle px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
            Kembali ke daftar
          </button>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {pending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
