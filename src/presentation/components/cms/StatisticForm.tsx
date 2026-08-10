"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { createStatisticAction, updateStatisticAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsStatistic } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card } from "@/presentation/components/cms/Card";
import { Checkbox, TextInput } from "@/presentation/components/cms/Field";
import { Notice } from "@/presentation/components/cms/Notice";

interface StatisticFormProps {
  mode: "create" | "edit";
  id?: string;
  initial?: CmsStatistic;
}

export function StatisticForm({ mode, id, initial }: StatisticFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = (formData: FormData) => {
    const input = {
      label: String(formData.get("label") ?? "").trim(),
      value: String(formData.get("value") ?? "").trim(),
      icon: String(formData.get("icon") ?? "").trim(),
      displayOrder: Number(formData.get("displayOrder") ?? 1),
      isPublished: formData.get("isPublished") === "on",
    };

    startTransition(async () => {
      const result: CmsActionResult = mode === "create" ? await createStatisticAction({ ...input, id: "" }) : await updateStatisticAction(id!, input);
      if (result.ok) {
        setNotice(result.message ?? "Statistik tersimpan.");
        setFieldErrors({});
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat menyimpan statistik.");
      }
    });
  };

  return (
    <form action={submit} className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Detail statistik</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextInput id="label" name="label" label="Label" required placeholder="Contoh: Tanah Terjual" defaultValue={initial?.label} error={fieldErrors.label} />
          <TextInput id="value" name="value" label="Nilai tampil" required placeholder="Contoh: 250+" defaultValue={initial?.value} error={fieldErrors.value} />
          <TextInput id="icon" name="icon" label="Ikon (opsional)" placeholder="Contoh: TrendingUp" defaultValue={initial?.icon} hint="Nama ikon Lucide yang dirender komponen beranda." />
          <TextInput id="displayOrder" name="displayOrder" label="Urutan tampil" type="number" required defaultValue={String(initial?.displayOrder ?? 1)} error={fieldErrors.displayOrder} />
        </div>
        <div className="mt-5">
          <Checkbox id="isPublished" name="isPublished" label="Tampil di situs" defaultValue={initial?.isPublished ?? true} />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-border-subtle px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
          Batal
        </button>
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? "Menyimpan..." : mode === "create" ? "Buat statistik" : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}