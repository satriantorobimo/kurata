"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { login } from "@/app/masuk/actions";
import { INITIAL_AUTH_FORM_STATE } from "@/application/dto/AuthFormDTO";
import { PasswordField } from "./PasswordField";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, INITIAL_AUTH_FORM_STATE);
  const errors = state.fieldErrors ?? {};

  if (state.status === "success") return <SuccessState message={state.message} />;

  return (
    <form action={formAction}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.status === "error" && <p className="mb-5 rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container" role="alert">{state.message}</p>}
      <div>
        <label htmlFor="email" className="text-label-md font-label-md text-on-surface">Email <span className="text-error">*</span></label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="nama@email.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-3 text-body-md text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" />
        {errors.email && <p id="email-error" className="mt-1.5 text-label-sm text-error" role="alert">{errors.email}</p>}
      </div>
      <div className="mt-5"><PasswordField id="password" name="password" label="Password" autoComplete="current-password" error={errors.password} /></div>
      <div className="mt-4 flex items-center justify-between gap-4"><label className="flex items-center gap-2 text-label-sm text-on-surface-variant"><input type="checkbox" name="rememberMe" className="h-4 w-4 rounded border-outline text-primary focus:ring-primary" />Ingat saya</label><Link href="/bantuan" className="text-label-sm font-label-sm text-primary hover:underline">Lupa password?</Link></div>
      <button type="submit" disabled={pending} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">{pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Memproses...</> : "Masuk"}</button>
      <p className="mt-6 text-center text-body-md text-on-surface-variant">Belum punya akun? <Link href="/daftar" className="font-semibold text-primary hover:underline">Daftar sekarang</Link></p>
      <p className="mt-5 rounded-lg bg-surface-container-low px-4 py-3 text-center text-label-sm leading-5 text-on-surface-variant">Mode pengembangan: form divalidasi, tetapi belum membuat sesi pengguna.</p>
    </form>
  );
}

function SuccessState({ message }: { message?: string }) {
  return <div className="rounded-xl border border-primary/20 bg-primary/5 p-7 text-center" role="status"><CheckCircle2 className="mx-auto h-11 w-11 text-primary" aria-hidden="true" /><h2 className="mt-4 text-headline-md font-headline-md text-on-surface">Data masuk valid</h2><p className="mt-3 text-body-md leading-6 text-on-surface-variant">{message}</p><Link href="/" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary">Kembali ke Beranda</Link></div>;
}
