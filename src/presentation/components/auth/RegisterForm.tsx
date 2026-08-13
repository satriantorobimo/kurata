"use client";

import Link from "next/link";
import { useActionState, useState, type ChangeEvent } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { register } from "@/app/daftar/actions";
import type { AuthField } from "@/application/dto/AuthFormDTO";
import { INITIAL_AUTH_FORM_STATE } from "@/application/dto/AuthFormDTO";
import { Button, ButtonLink } from "@/presentation/components/shared/Button";
import { Checkbox, TextInput } from "@/presentation/components/shared/FormField";
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
        <ButtonLink href="/masuk" className="mt-6 px-5 py-3">Ke Halaman Masuk</ButtonLink>
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
        <TextInput id="fullName" name="fullName" label="Nama lengkap" autoComplete="name" required value={values.fullName} error={errors.fullName} onChange={handleChange("fullName")} />
        <TextInput id="phone" name="phone" label="Nomor WhatsApp" type="tel" autoComplete="tel" inputMode="tel" required value={values.phone} error={errors.phone} onChange={handleChange("phone")} />
      </div>

      <div className="mt-5">
        <TextInput id="email" name="email" label="Email" type="email" autoComplete="email" placeholder="nama@email.com" required value={values.email} error={errors.email} onChange={handleChange("email")} />
      </div>

      <div className="mt-5">
        <PasswordField id="password" name="password" label="Password" autoComplete="new-password" hint="Minimal 8 karakter, huruf dan angka." value={values.password} error={errors.password} onChange={handleChange("password")} />
      </div>

      <div className="mt-5">
        <PasswordField id="confirmPassword" name="confirmPassword" label="Konfirmasi password" autoComplete="new-password" value={values.confirmPassword} error={errors.confirmPassword} onChange={handleChange("confirmPassword")} />
      </div>

      <Checkbox id="acceptedTerms" name="acceptedTerms" checked={acceptedTerms} onChange={handleTermsChange} error={errors.acceptedTerms} className="mt-6 text-label-sm leading-5" label="Saya menyetujui data ini digunakan untuk proses pembuatan akun Kurata dan memahami ketentuan layanan Kurata." />

      <Button type="submit" disabled={!canSubmit} loading={pending} className="mt-7 w-full py-3">
        {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Membuat akun...</> : "Daftar Akun"}
      </Button>

      <p className="mt-6 text-center text-body-md text-on-surface-variant">Sudah punya akun? <Link href="/masuk" className="font-semibold text-primary hover:underline">Masuk</Link></p>
    </form>
  );
}
