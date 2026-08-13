"use client";

import { useActionState } from "react";
import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { INITIAL_SERVICE_INQUIRY_STATE } from "@/application/dto/ServiceInquiryDTO";
import { submitServiceInquiry } from "@/app/layanan/actions";
import type { ServiceDefinition } from "@/application/config/serviceCatalog";
import { Button } from "@/presentation/components/shared/Button";
import { Checkbox, SelectInput, TextArea, TextInput } from "@/presentation/components/shared/FormField";

const ROLE_OPTIONS = [
  { value: "owner", label: "Pemilik tanah" },
  { value: "buyer", label: "Pembeli" },
  { value: "investor", label: "Investor" },
  { value: "broker", label: "Mitra Kurata" },
];

export function ServiceInquiryForm({ services }: { services: ServiceDefinition[] }) {
  const [state, formAction, pending] = useActionState(
    submitServiceInquiry,
    INITIAL_SERVICE_INQUIRY_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
        <h3 className="text-headline-md font-headline-md text-on-surface">Permintaan konsultasi diterima</h3>
        <p className="mt-3 text-body-md leading-6 text-on-surface-variant">{state.message}</p>
        <p className="mt-4 text-label-md font-label-md text-primary">Referensi: {state.reference}</p>
        <p className="mt-5 text-label-sm leading-5 text-on-surface-variant">Permintaan Anda telah tersimpan. Tim Kurata akan menindaklanjuti berdasarkan informasi yang Anda berikan.</p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mb-7">
        <h2 className="text-headline-md font-headline-md text-on-surface">Ceritakan kebutuhan Anda</h2>
        <p className="mt-2 text-body-md leading-6 text-on-surface-variant">Tim Kurata akan menggunakan informasi ini untuk memahami konteks awal dan mengarahkan langkah berikutnya.</p>
      </div>

      {state.status === "error" && <p className="mb-5 rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container" role="alert">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput id="fullName" name="fullName" label="Nama lengkap" autoComplete="name" required error={errors.fullName} />
        <TextInput id="email" name="email" label="Email" type="email" autoComplete="email" required error={errors.email} />
        <TextInput id="phone" name="phone" label="Nomor WhatsApp" type="tel" autoComplete="tel" inputMode="tel" required error={errors.phone} />
        <SelectInput id="role" name="role" label="Saya sebagai" required error={errors.role} options={ROLE_OPTIONS} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SelectInput id="service" name="service" label="Layanan yang diminati" required error={errors.service} options={services.map((service) => ({ value: service.id, label: service.title }))} />
        <TextInput id="area" name="area" label="Lokasi / area properti" hint="Contoh: Canggu, Badung, Bali" required error={errors.area} />
      </div>

      <fieldset className="mt-6">
        <legend className="text-label-md font-label-md text-on-surface">Pilihan kontak <span className="text-error">*</span></legend>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-body-md text-on-surface hover:border-primary"><input type="radio" name="preferredContact" value="whatsapp" required className="h-4 w-4 border-outline text-primary focus:ring-primary" />WhatsApp</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-body-md text-on-surface hover:border-primary"><input type="radio" name="preferredContact" value="email" required className="h-4 w-4 border-outline text-primary focus:ring-primary" />Email</label>
        </div>
        {errors.preferredContact ? <p id="preferredContact-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.preferredContact}</p> : null}
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextInput id="budget" name="budget" label="Kisaran anggaran / harga" hint="Opsional" placeholder="Contoh: Rp2–3 miliar" />
        <TextInput id="listingUrl" name="listingUrl" label="Tautan listing terkait" type="url" inputMode="url" hint="Opsional" placeholder="https://" error={errors.listingUrl} />
      </div>

      <TextArea id="description" name="description" label="Kebutuhan atau pertanyaan Anda" hint="Minimal 20 karakter. Cukup informasi umum—jangan kirim nomor identitas atau dokumen kepemilikan." rows={5} minLength={20} maxLength={1500} required error={errors.description} className="mt-5" placeholder="Contoh: Saya ingin mencari tanah untuk villa di area Canggu, dengan akses jalan yang baik." />

      <Checkbox id="acceptedTerms" name="acceptedTerms" error={errors.acceptedTerms} className="mt-6" label="Saya menyetujui Kurata menggunakan data ini untuk menindaklanjuti permintaan konsultasi saya. Saya memahami bahwa informasi awal bukan penilaian resmi atau nasihat hukum." />

      <div className="mt-7 border-t border-border-subtle pt-6">
        <Button type="submit" loading={pending} className="w-full py-3">
          {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Mengirim permintaan...</> : "Kirim Permintaan Konsultasi"}
        </Button>
        <div className="mt-4 flex items-start gap-2 text-label-sm leading-5 text-on-surface-variant"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />Jangan masukkan nomor identitas, sertifikat, atau dokumen sensitif pada formulir ini.</div>
      </div>
    </form>
  );
}
