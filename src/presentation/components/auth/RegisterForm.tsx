"use client";

import Link from "next/link";
import { useActionState, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { register } from "@/app/daftar/actions";
import type { AuthField, AuthFormState } from "@/application/dto/AuthFormDTO";
import { INITIAL_AUTH_FORM_STATE } from "@/application/dto/AuthFormDTO";
import { PasswordField } from "./PasswordField";

type FieldValues = Record<AuthField, string>;

const REQUIRED: AuthField[] = ["fullName", "phone", "email", "password", "confirmPassword"];

function allRequiredFilled(values: FieldValues, acceptedTerms: boolean): boolean {
  if (!acceptedTerms) return false;
  return REQUIRED.every((field) => values[field].trim().length > 0);
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, INITIAL_AUTH_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<AuthField, string>>>({});
  const [values, setValues] = useState<FieldValues>({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", acceptedTerms: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const errors = state.status === "error" ? { ...fieldErrors, ...state.fieldErrors } : fieldErrors;
  const canSubmit = allRequiredFilled(values, acceptedTerms) && !pending;

  function handleChange(field: AuthField) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setValues((prev) => ({ ...prev, [field]: next }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    };
  }

  function handleTermsChange(e: ChangeEvent<HTMLInputElement>) {
    setAcceptedTerms(e.target.checked);
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.acceptedTerms;
      return copy;
    });
  }

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-7 text-center" role="status">
        <CheckCircle2 className="mx-auto h-11 w-11 text-primary" aria-hidden="true" />
        <h2 className="mt-4 text-headline-md font-headline-md text-on-surface">Akun berhasil dibuat</h2>
        <p className="mt-3 text-body-md leading-6 text-on-surface-variant">{state.message}</p>
        <Link href="/masuk" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary">Ke Halaman Masuk</Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.status === "error" && state.message && (
        <p className="mb-5 rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container" role="alert">{state.message}</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="fullName" name="fullName" label="Nama lengkap" autoComplete="name" required value={values.fullName} error={errors.fullName} onChange={handleChange("fullName")} />
        <TextField id="phone" name="phone" label="Nomor WhatsApp" type="tel" autoComplete="tel" inputMode="tel" required value={values.phone} error={errors.phone} onChange={handleChange("phone")} />
      </div>

      <div className="mt-5">
        <TextField id="email" name="email" label="Email" type="email" autoComplete="email" placeholder="nama@email.com" required value={values.email} error={errors.email} onChange={handleChange("email")} />
      </div>

      <div className="mt-5">
        <PasswordField id="password" name="password" label="Password" autoComplete="new-password" hint="Minimal 8 karakter, huruf dan angka." value={values.password} error={errors.password} onChange={handleChange("password")} />
      </div>

      <div className="mt-5">
        <PasswordField id="confirmPassword" name="confirmPassword" label="Konfirmasi password" autoComplete="new-password" value={values.confirmPassword} error={errors.confirmPassword} onChange={handleChange("confirmPassword")} />
      </div>

      <div className="mt-6">
        <label className={`inline-flex cursor-pointer items-start gap-3 text-label-sm leading-5 ${errors.acceptedTerms ? "text-error" : "text-on-surface-variant"}`}>
          <input type="checkbox" name="acceptedTerms" checked={acceptedTerms} onChange={handleTermsChange} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
          <span>Saya menyetujui data ini digunakan untuk proses pembuatan akun Kurata dan memahami ketentuan layanan Kurata.</span>
        </label>
        {errors.acceptedTerms && <p className="mt-1.5 text-label-sm text-error" role="alert">{errors.acceptedTerms}</p>}
      </div>

      <button type="submit" disabled={!canSubmit} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
        {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Membuat akun...</> : "Daftar Akun"}
      </button>

      <p className="mt-6 text-center text-body-md text-on-surface-variant">Sudah punya akun? <Link href="/masuk" className="font-semibold text-primary hover:underline">Masuk</Link></p>
    </form>
  );
}

function TextField({ id, name, label, type = "text", error, ...props }: { id: string; name: string; label: string; type?: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-label-md font-label-md text-on-surface">
        {label} {props.required && <span className="text-error">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-3 text-body-md text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error"
        {...props}
      />
      {error && <p id={`${id}-error`} className="mt-1.5 text-label-sm text-error" role="alert">{error}</p>}
    </div>
  );
}
