"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { createPropertyAction, updatePropertyAction, type CmsActionResult } from "@/app/cms/actions";
import type { CmsBrokerOption, CmsPropertyDetail, CmsSalesOption } from "@/infrastructure/repositories/PostgresCmsRepository";
import { Card } from "@/presentation/components/cms/Card";
import { Checkbox, SelectInput, TextArea, TextInput } from "@/presentation/components/cms/Field";
import { ImageUpload } from "@/presentation/components/cms/ImageUpload";
import { Notice } from "@/presentation/components/cms/Notice";

const CERTIFICATES = [
  { value: "SHM", label: "SHM — Hak Milik" },
  { value: "HGB", label: "HGB — Hak Guna Bangunan" },
  { value: "HGU", label: "HGU — Hak Guna Usaha" },
  { value: "HP", label: "HP — Hak Pakai" },
];

const BADGES = [
  { value: "", label: "Tanpa badge" },
  { value: "exclusive", label: "Exclusive Kurata" },
  { value: "broker", label: "Mitra Kurata" },
];

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: string;
  initial?: CmsPropertyDetail;
  brokers: CmsBrokerOption[];
  sales: CmsSalesOption[];
  landType: "common" | "business_potential";
}

function parseFacilities(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinFacilities(value: string[] | null | undefined): string {
  return (value ?? []).join(", ");
}

export function PropertyForm({ mode, propertyId, initial, brokers, sales, landType }: PropertyFormProps) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    const isPublished = formData.get("isPublished") === "on";
    const input = {
      title: String(formData.get("title") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      province: String(formData.get("province") ?? "").trim(),
      priceAmount: Number(formData.get("priceAmount") ?? 0),
      areaSqm: Number(formData.get("areaSqm") ?? 0),
      certificate: String(formData.get("certificate") ?? "SHM"),
      badge: String(formData.get("badge") ?? "") === "" ? null : String(formData.get("badge")),
      imageUrl: String(formData.get("imageUrl") ?? "").trim(),
      landType,
      description: String(formData.get("description") ?? "").trim() || null,
      dimensions: String(formData.get("dimensions") ?? "").trim() || null,
      zoning: String(formData.get("zoning") ?? "").trim() || null,
      roadAccess: String(formData.get("roadAccess") ?? "").trim() || null,
      legalStatus: String(formData.get("legalStatus") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
      facilities: parseFacilities(String(formData.get("facilities") ?? "")),
      listedAt: String(formData.get("listedAt") ?? "").trim() || null,
      contactLabel: String(formData.get("contactLabel") ?? "").trim() || null,
      listedBy: String(formData.get("listedBy") ?? "") || null,
      salesId: String(formData.get("salesId") ?? "") || null,
      isPublished,
      reviewStatus: isPublished ? "published" : "draft",
    };

    startTransition(async () => {
      const result: CmsActionResult = mode === "create" ? await createPropertyAction(input) : await updatePropertyAction(propertyId!, input);
      if (result.ok) {
        setFieldErrors({});
        setNotice(result.message ?? "Berhasil disimpan.");
        router.refresh();
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setNotice(result.message ?? "Tidak dapat menyimpan perubahan.");
      }
    });
  };

  const error = (name: string) => fieldErrors[name];

  return (
    <form action={submit} className="space-y-6">
      {notice ? <Notice tone={notice.includes("berhas") ? "success" : "error"} message={notice} onDismiss={() => setNotice("")} /> : null}

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Informasi dasar</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <TextInput id="title" name="title" label="Judul aset" required placeholder="Contoh: Tanah SHM di Cibubur" defaultValue={initial?.title} error={error("title")} />
          </div>
          <TextInput id="city" name="city" label="Kota" required placeholder="Contoh: Bekasi" defaultValue={initial?.city} error={error("city")} />
          <TextInput id="province" name="province" label="Provinsi" required placeholder="Contoh: Jawa Barat" defaultValue={initial?.province} error={error("province")} />
          <TextInput id="priceAmount" name="priceAmount" label="Harga (Rp)" required type="number" defaultValue={initial ? String(initial.priceAmount) : undefined} error={error("priceAmount")} />
          <TextInput id="areaSqm" name="areaSqm" label="Luas (m²)" required type="number" defaultValue={initial ? String(initial.areaSqm) : undefined} error={error("areaSqm")} />
          <SelectInput id="certificate" name="certificate" label="Sertifikat" required options={CERTIFICATES} defaultValue={initial?.certificate ?? "SHM"} error={error("certificate")} />
          <SelectInput id="badge" name="badge" label="Badge" options={BADGES} defaultValue={initial?.badge ?? ""} error={error("badge")} />
          <div className="sm:col-span-2">
            <ImageUpload name="imageUrl" label="Foto utama" required currentUrl={initial?.imageUrl} hint="Pilih dan unggah foto. Maks 5 MB, format JPG/PNG/WebP/AVIF." />
          </div>
        </div>
      </Card>

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Deskripsi & detail</div>
        <div className="mt-5 space-y-5">
          <TextArea id="description" name="description" label="Deskripsi" rows={5} defaultValue={initial?.description ?? undefined} placeholder="Ceritakan kondisi, akses, dan potensi tanah." />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput id="dimensions" name="dimensions" label="Dimensi" placeholder="Contoh: 15 × 25 m" defaultValue={initial?.dimensions ?? undefined} />
            <TextInput id="zoning" name="zoning" label="Zonasi / Peruntukan" placeholder="Contoh: Perumahan" defaultValue={initial?.zoning ?? undefined} />
            <TextInput id="roadAccess" name="roadAccess" label="Akses jalan" placeholder="Contoh: 8 meter, aspal" defaultValue={initial?.roadAccess ?? undefined} />
            <TextInput id="legalStatus" name="legalStatus" label="Status legal" placeholder="Contoh: Bersertifikat, bebas sengketa" defaultValue={initial?.legalStatus ?? undefined} />
          </div>
          <TextArea id="address" name="address" label="Alamat lengkap" rows={3} defaultValue={initial?.address ?? undefined} />
          <TextInput id="facilities" name="facilities" label="Fasilitas" hint="Pisahkan dengan koma. Contoh: dekat jalan utama, listrik, air PAM" defaultValue={joinFacilities(initial?.facilities)} />
        </div>
      </Card>

      <Card>
        <div className="text-headline-sm font-headline-sm text-on-surface">Penayangan & penanggung jawab</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <SelectInput id="listedBy" name="listedBy" label="Ditayangkan oleh (Mitra)" options={[{ value: "", label: "Kurata (tanpa mitra)" }, ...brokers.map((broker) => ({ value: broker.id, label: `${broker.fullName} — ${broker.email}` }))]} defaultValue={initial?.listedBy ?? ""} hint="Kosongkan bila dikelola langsung oleh Kurata." />
          <SelectInput id="salesId" name="salesId" label="Sales / Marketing" options={[{ value: "", label: "Tidak ditugaskan" }, ...sales.map((s) => ({ value: s.id, label: `${s.name} — ${s.email}` }))]} defaultValue={initial?.salesId ?? ""} hint="Sales yang bertanggung jawab atas listing ini." />
          <TextInput id="contactLabel" name="contactLabel" label="Label kontak" placeholder="Contoh: Hubungi WhatsApp" defaultValue={initial?.contactLabel ?? undefined} />
          <TextInput id="listedAt" name="listedAt" label="Tanggal listing" placeholder="Contoh: 2026-08-09" defaultValue={initial?.listedAt ?? undefined} />
        </div>
        <div className="mt-5">
          <Checkbox id="isPublished" name="isPublished" label="Tayangkan langsung di situs publik" defaultValue={initial?.isPublished ?? false} />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-border-subtle px-5 py-3 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
          Batal
        </button>
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {pending ? "Menyimpan..." : mode === "create" ? "Buat aset" : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}
