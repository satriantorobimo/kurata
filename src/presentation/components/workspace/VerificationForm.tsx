"use client";

import { useActionState } from "react";
import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { INITIAL_VERIFICATION_FORM_STATE } from "@/application/dto/VerificationFormDTO";
import { submitVerification } from "@/app/dashboard/verification/actions";

export function VerificationForm() {
  const [state, formAction, pending] = useActionState(
    submitVerification,
    INITIAL_VERIFICATION_FORM_STATE,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden="true" />
        <h3 className="text-headline-md font-headline-md text-on-surface">Verifikasi diajukan</h3>
        <p className="mt-3 text-body-md leading-6 text-on-surface-variant">{state.message}</p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
      <div className="mb-7">
        <h2 className="text-headline-md font-headline-md text-on-surface">Formulir Verifikasi Identitas</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">Lengkapi data berikut sesuai KTP Anda untuk memulai proses verifikasi.</p>
      </div>

      {state.status === "error" && state.message && (
        <p className="mb-5 rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container" role="alert">{state.message}</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nik" className="text-label-md font-label-md text-on-surface">NIK <span className="text-error">*</span></label>
          <input id="nik" name="nik" type="text" inputMode="numeric" maxLength={16} autoComplete="off" required aria-invalid={Boolean(errors.nik)} aria-describedby={errors.nik ? "nik-error" : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" placeholder="16 digit NIK KTP" />
          {errors.nik && <p id="nik-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.nik}</p>}
        </div>
        <div>
          <label htmlFor="verif-fullName" className="text-label-md font-label-md text-on-surface">Nama sesuai KTP <span className="text-error">*</span></label>
          <input id="verif-fullName" name="fullName" type="text" autoComplete="name" required aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" placeholder="Nama lengkap Anda" />
          {errors.fullName && <p id="fullName-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="birthPlace" className="text-label-md font-label-md text-on-surface">Tempat lahir <span className="text-error">*</span></label>
          <input id="birthPlace" name="birthPlace" type="text" autoComplete="off" required aria-invalid={Boolean(errors.birthPlace)} aria-describedby={errors.birthPlace ? "birthPlace-error" : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" placeholder="Kota/kabupaten tempat lahir" />
          {errors.birthPlace && <p id="birthPlace-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.birthPlace}</p>}
        </div>
        <div>
          <label htmlFor="birthDate" className="text-label-md font-label-md text-on-surface">Tanggal lahir <span className="text-error">*</span></label>
          <input id="birthDate" name="birthDate" type="date" required aria-invalid={Boolean(errors.birthDate)} aria-describedby={errors.birthDate ? "birthDate-error" : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" />
          {errors.birthDate && <p id="birthDate-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.birthDate}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="verif-address" className="text-label-md font-label-md text-on-surface">Alamat sesuai KTP <span className="text-error">*</span></label>
        <textarea id="verif-address" name="address" rows={3} maxLength={500} required aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} className="mt-2 w-full resize-y rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" placeholder="Alamat lengkap sesuai KTP" />
        {errors.address && <p id="address-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.address}</p>}
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-body-md text-on-surface-variant">
        <input type="checkbox" name="agreement" className="mt-1 h-4 w-4 shrink-0 rounded border-outline text-primary focus:ring-primary" />
        <span>Saya menyatakan data di atas benar dan sesuai dengan KTP. Saya memahami bahwa Kurata berhak menolak atau meminta perbaikan data bila ditemukan ketidaksesuaian.</span>
      </label>
      {errors.agreement && <p id="agreement-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.agreement}</p>}

      <div className="mt-7 border-t border-border-subtle pt-6">
        <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Mengirim verifikasi...</> : "Ajukan Verifikasi"}
        </button>
        <div className="mt-4 flex items-start gap-2 text-label-sm text-on-surface-variant"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />Data Anda hanya digunakan untuk proses verifikasi identitas dan dilindungi sesuai kebijakan privasi Kurata.</div>
      </div>
    </form>
  );
}
