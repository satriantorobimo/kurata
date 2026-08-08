"use client";

import { useActionState, type InputHTMLAttributes } from "react";
import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { INITIAL_SERVICE_INQUIRY_STATE } from "@/application/dto/ServiceInquiryDTO";
import { SERVICE_CATALOG } from "@/application/config/serviceCatalog";
import { submitServiceInquiry } from "@/app/layanan/actions";

const ROLE_OPTIONS = [
  { value: "owner", label: "Pemilik tanah" },
  { value: "buyer", label: "Pembeli" },
  { value: "investor", label: "Investor" },
  { value: "broker", label: "Mitra Kurata" },
];

export function ServiceInquiryForm() {
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
        <p className="mt-5 text-label-sm leading-5 text-on-surface-variant">Data saat ini disimpan dalam mode pengembangan. Hubungkan formulir ke CRM atau basis data sebelum menerima konsultasi produksi.</p>
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
        <TextField id="fullName" name="fullName" label="Nama lengkap" autoComplete="name" required error={errors.fullName} />
        <TextField id="email" name="email" label="Email" type="email" autoComplete="email" required error={errors.email} />
        <TextField id="phone" name="phone" label="Nomor WhatsApp" type="tel" autoComplete="tel" inputMode="tel" required error={errors.phone} />
        <SelectField id="role" name="role" label="Saya sebagai" required error={errors.role} options={ROLE_OPTIONS} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SelectField id="service" name="service" label="Layanan yang diminati" required error={errors.service} options={SERVICE_CATALOG.map((service) => ({ value: service.id, label: service.title }))} />
        <TextField id="area" name="area" label="Lokasi / area properti" hint="Contoh: Canggu, Badung, Bali" required error={errors.area} />
      </div>

      <fieldset className="mt-6">
        <legend className="text-label-md font-label-md text-on-surface">Pilihan kontak <span className="text-error">*</span></legend>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-body-md text-on-surface hover:border-primary"><input type="radio" name="preferredContact" value="whatsapp" required className="h-4 w-4 border-outline text-primary focus:ring-primary" />WhatsApp</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-body-md text-on-surface hover:border-primary"><input type="radio" name="preferredContact" value="email" required className="h-4 w-4 border-outline text-primary focus:ring-primary" />Email</label>
        </div>
        <FieldError id="preferredContact-error" message={errors.preferredContact} />
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextField id="budget" name="budget" label="Kisaran anggaran / harga" hint="Opsional" placeholder="Contoh: Rp2–3 miliar" />
        <TextField id="listingUrl" name="listingUrl" label="Tautan listing terkait" type="url" inputMode="url" hint="Opsional" placeholder="https://" error={errors.listingUrl} />
      </div>

      <div className="mt-5">
        <label htmlFor="description" className="text-label-md font-label-md text-on-surface">Kebutuhan atau pertanyaan Anda <span className="text-error">*</span></label>
        <p className="mt-1 text-label-sm text-on-surface-variant">Minimal 20 karakter. Cukup informasi umum—jangan kirim nomor identitas atau dokumen kepemilikan.</p>
        <textarea id="description" name="description" rows={5} minLength={20} maxLength={1500} required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} className="mt-2 w-full resize-y rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" placeholder="Contoh: Saya ingin mencari tanah untuk villa di area Canggu, dengan akses jalan yang baik." />
        <FieldError id="description-error" message={errors.description} />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-body-md leading-6 text-on-surface-variant">
        <input type="checkbox" name="acceptedTerms" className="mt-1 h-4 w-4 shrink-0 rounded border-outline text-primary focus:ring-primary" />
        <span>Saya menyetujui Kurata menggunakan data ini untuk menindaklanjuti permintaan konsultasi saya. Saya memahami bahwa informasi awal bukan penilaian resmi atau nasihat hukum.</span>
      </label>
      <FieldError id="acceptedTerms-error" message={errors.acceptedTerms} />

      <div className="mt-7 border-t border-border-subtle pt-6">
        <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Mengirim permintaan...</> : "Kirim Permintaan Konsultasi"}
        </button>
        <div className="mt-4 flex items-start gap-2 text-label-sm leading-5 text-on-surface-variant"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />Jangan masukkan nomor identitas, sertifikat, atau dokumen sensitif pada formulir ini.</div>
      </div>
    </form>
  );
}

function TextField({ id, name, label, type = "text", hint, error, ...props }: { id: string; name: string; label: string; type?: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return <div><label htmlFor={id} className="text-label-md font-label-md text-on-surface">{label} {props.required && <span className="text-error">*</span>}</label>{hint && <p className="mt-1 text-label-sm text-on-surface-variant">{hint}</p>}<input id={id} name={name} type={type} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" {...props} /><FieldError id={`${id}-error`} message={error} /></div>;
}

function SelectField({ id, name, label, options, error, required }: { id: string; name: string; label: string; options: { value: string; label: string }[]; error?: string; required?: boolean }) {
  return <div><label htmlFor={id} className="text-label-md font-label-md text-on-surface">{label} {required && <span className="text-error">*</span>}</label><select id={id} name={name} required={required} defaultValue="" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error"><option value="" disabled>Pilih salah satu</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><FieldError id={`${id}-error`} message={error} /></div>;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="mt-1.5 text-label-sm text-error" role="alert">{message}</p> : null;
}
