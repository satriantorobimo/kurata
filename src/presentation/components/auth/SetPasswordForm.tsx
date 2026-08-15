"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import { setPassword, type SetPasswordState } from "@/app/set-password/actions";
import { Button, ButtonLink } from "@/presentation/components/shared/Button";
import { PasswordField } from "./PasswordField";

export function SetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(setPassword, { status: "idle" } satisfies SetPasswordState);

  if (state.status === "success") {
    return <div className="rounded-xl border border-primary/20 bg-primary/5 p-7 text-center" role="status"><CheckCircle2 className="mx-auto h-11 w-11 text-primary" aria-hidden="true" /><h2 className="mt-4 text-headline-md font-headline-md text-on-surface">Password berhasil dibuat</h2><p className="mt-3 text-body-md leading-6 text-on-surface-variant">{state.message}</p><ButtonLink href="/masuk" className="mt-6 px-5 py-3">Masuk ke akun</ButtonLink></div>;
  }

  return <form action={formAction}>
    <input type="hidden" name="token" value={token} />
    {state.status === "error" && state.message ? <p className="mb-5 rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container" role="alert">{state.message}</p> : null}
    <PasswordField id="password" name="password" label="Password baru" autoComplete="new-password" hint="Minimal 8 karakter, huruf dan angka." error={state.fieldErrors?.password} />
    <div className="mt-5"><PasswordField id="confirmPassword" name="confirmPassword" label="Konfirmasi password" autoComplete="new-password" error={state.fieldErrors?.confirmPassword} /></div>
    <Button type="submit" loading={pending} className="mt-7 w-full py-3">{pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Menyimpan...</> : "Buat password"}</Button>
    <p className="mt-6 text-center text-body-md text-on-surface-variant">Sudah punya password? <Link href="/masuk" className="font-semibold text-primary hover:underline">Masuk</Link></p>
  </form>;
}
