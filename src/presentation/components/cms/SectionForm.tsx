"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { createContentSectionAction, updateContentSectionAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsContentSection } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card } from "@/presentation/components/cms/Card";
import { Checkbox, TextInput } from "@/presentation/components/cms/Field";
import { Notice } from "@/presentation/components/cms/Notice";

interface SectionFormProps {
  mode: "create" | "edit";
  id?: string;
  initial?: CmsContentSection;
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function SectionForm({ mode, id, initial }: SectionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(initial ? formatJson(initial.content) : "{}");
  const [contentError, setContentError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = (formData: FormData) => {
    setContentError("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      setContentError("Isi konten bukan JSON yang valid.");
      return;
    }

    const input = {
      id: String(formData.get("id") ?? "").trim() || undefined,
      section: String(formData.get("section") ?? "").trim(),
      content: parsed,
      position: Number(formData.get("position") ?? 1),
      isPublished: formData.get("isPublished") === "on",
    };

    startTransition(async () => {
      const result: CmsActionResult = mode === "create" ? await createContentSectionAction(input) : await updateContentSectionAction(id!, input);
      if (result.ok) {
        setNotice(result.message ?? "Segmen tersimpan.");
        router.refresh();
      } else {
        setNotice(result.message ?? "Tidak dapat menyimpan segmen.");
      }
    });
  };

  return (
    <form action={submit} className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Identitas segmen</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextInput id="section" name="section" label="Nama segmen" required placeholder="Contoh: hero-home" defaultValue={initial?.section} />
          <TextInput id="position" name="position" label="Urutan tampil" type="number" defaultValue={String(initial?.position ?? 1)} />
          <div className="sm:col-span-2">
            <TextInput id="id" name="id" label="ID segmen" required disabled={mode === "edit"} defaultValue={initial?.id} hint={mode === "edit" ? "ID tidak dapat diubah." : "Kunci unik segmen (huruf kecil, tanpa spasi)."} />
          </div>
        </div>
        <div className="mt-5">
          <Checkbox id="isPublished" name="isPublished" label="Aktif di situs" defaultValue={initial?.isPublished ?? true} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-headline-sm font-headline-sm text-on-surface">Isi konten (JSON)</div>
            <p className="mt-1 text-body-md text-on-surface-variant">Konten fleksibel yang dibaca komponen halaman. Pastikan valid JSON.</p>
          </div>
        </div>
        <div className="mt-5">
          <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={16} spellCheck={false} aria-label="Isi konten JSON" aria-invalid={Boolean(contentError)} className="w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-4 py-3 font-mono text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" />
          {contentError ? <p className="mt-1.5 text-label-sm text-error" role="alert">{contentError}</p> : null}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-border-subtle px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
          Batal
        </button>
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? "Menyimpan..." : mode === "create" ? "Buat segmen" : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}