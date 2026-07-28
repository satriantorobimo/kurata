"use client";

import { useActionState, type InputHTMLAttributes } from "react";
import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import {
  BROKER_EXPERIENCE_LEVELS,
  BROKER_SPECIALIZATIONS,
  BROKER_TYPES,
} from "@/domain/entities/BrokerApplication";
import { INITIAL_BROKER_APPLICATION_STATE } from "@/application/dto/BrokerApplicationDTO";
import { submitBrokerApplication } from "@/app/untuk-broker/actions";

const EXPERIENCE_LABELS: Record<(typeof BROKER_EXPERIENCE_LEVELS)[number], string> = {
  "less-than-1-year": "Kurang dari 1 tahun",
  "1-to-3-years": "1–3 tahun",
  "3-to-5-years": "3–5 tahun",
  "more-than-5-years": "Lebih dari 5 tahun",
};

const SPECIALIZATION_LABELS: Record<(typeof BROKER_SPECIALIZATIONS)[number], string> = {
  "residential-land": "Tanah hunian",
  "commercial-land": "Tanah komersial",
  "agricultural-land": "Tanah pertanian",
  "industrial-land": "Tanah industri",
};

const BROKER_TYPE_LABELS: Record<(typeof BROKER_TYPES)[number], string> = {
  independent: "Broker independen",
  agency: "Bagian dari agency",
};

export function BrokerRegistrationForm() {
  const [state, formAction, pending] = useActionState(
    submitBrokerApplication,
    INITIAL_BROKER_APPLICATION_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
        <h3 className="text-headline-md font-headline-md text-on-surface">Pendaftaran diterima</h3>
        <p className="mt-3 text-body-md leading-6 text-on-surface-variant">{state.message}</p>
        <p className="mt-4 text-label-md font-label-md text-primary">Referensi: {state.reference}</p>
        <p className="mt-5 text-label-sm text-on-surface-variant">Data saat ini disimpan dalam mode pengembangan. Hubungkan formulir ke CRM atau basis data sebelum digunakan untuk pendaftaran produksi.</p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mb-7">
        <h2 className="text-headline-md font-headline-md text-on-surface">Formulir Pendaftaran Broker</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">Lengkapi data berikut untuk memulai proses peninjauan awal.</p>
      </div>

      {state.status === "error" && <p className="mb-5 rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container" role="alert">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="fullName" name="fullName" label="Nama lengkap" autoComplete="name" required error={errors.fullName} />
        <TextField id="email" name="email" label="Email" type="email" autoComplete="email" required error={errors.email} />
        <TextField id="phone" name="phone" label="Nomor WhatsApp" type="tel" autoComplete="tel" inputMode="tel" required error={errors.phone} />
        <TextField id="city" name="city" label="Kota / domisili" autoComplete="address-level2" required error={errors.city} />
      </div>

      <div className="mt-5">
        <TextField id="operatingAreas" name="operatingAreas" label="Area operasional utama" hint="Contoh: Jakarta Selatan, Depok, dan Bogor" required error={errors.operatingAreas} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <SelectField id="experienceLevel" name="experienceLevel" label="Pengalaman di bidang properti" required error={errors.experienceLevel} options={BROKER_EXPERIENCE_LEVELS.map((value) => ({ value, label: EXPERIENCE_LABELS[value] }))} />
        <SelectField id="brokerType" name="brokerType" label="Jenis broker" required error={errors.brokerType} options={BROKER_TYPES.map((value) => ({ value, label: BROKER_TYPE_LABELS[value] }))} />
      </div>

      <fieldset className="mt-6">
        <legend className="text-label-md font-label-md text-on-surface">Spesialisasi properti <span className="text-error">*</span></legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {BROKER_SPECIALIZATIONS.map((specialization) => (
            <label key={specialization} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle px-4 py-3 text-body-md text-on-surface hover:border-primary">
              <input type="checkbox" name="specializations" value={specialization} className="h-4 w-4 rounded border-outline text-primary focus:ring-primary" />
              {SPECIALIZATION_LABELS[specialization]}
            </label>
          ))}
        </div>
        <FieldError id="specializations-error" message={errors.specializations} />
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextField id="companyName" name="companyName" label="Nama agency / perusahaan" hint="Opsional" />
        <TextField id="portfolioUrl" name="portfolioUrl" label="Tautan portofolio atau profil" type="url" inputMode="url" hint="Opsional" error={errors.portfolioUrl} />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="text-label-md font-label-md text-on-surface">Pesan tambahan <span className="font-normal text-on-surface-variant">(opsional)</span></label>
        <textarea id="message" name="message" rows={4} maxLength={1000} className="mt-2 w-full resize-y rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Ceritakan singkat pengalaman atau fokus area Anda." />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-body-md text-on-surface-variant">
        <input type="checkbox" name="acceptedTerms" className="mt-1 h-4 w-4 shrink-0 rounded border-outline text-primary focus:ring-primary" />
        <span>Saya menyetujui data ini digunakan untuk proses peninjauan pendaftaran Broker Partner Kurata dan memahami bahwa data perlu diverifikasi kembali.</span>
      </label>
      <FieldError id="acceptedTerms-error" message={errors.acceptedTerms} />

      <div className="mt-7 border-t border-border-subtle pt-6">
        <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Mengirim pendaftaran...</> : "Kirim Pendaftaran"}
        </button>
        <div className="mt-4 flex items-start gap-2 text-label-sm text-on-surface-variant"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />Jangan masukkan nomor identitas, dokumen kepemilikan, atau data sensitif lain pada formulir ini.</div>
      </div>
    </form>
  );
}

function TextField({ id, name, label, type = "text", hint, error, ...props }: { id: string; name: string; label: string; type?: string; hint?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-label-md font-label-md text-on-surface">{label} {props.required && <span className="text-error">*</span>}</label>
      {hint && <p className="mt-1 text-label-sm text-on-surface-variant">{hint}</p>}
      <input id={id} name={name} type={type} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" {...props} />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function SelectField({ id, name, label, options, error, required }: { id: string; name: string; label: string; options: { value: string; label: string }[]; error?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="text-label-md font-label-md text-on-surface">{label} {required && <span className="text-error">*</span>}</label>
      <select id={id} name={name} required={required} defaultValue="" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error">
        <option value="" disabled>Pilih salah satu</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="mt-1.5 text-label-sm text-error" role="alert">{message}</p> : null;
}
