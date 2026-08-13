"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle, MailQuestion } from "lucide-react";
import { login } from "@/app/masuk/actions";
import { resendVerificationEmailAction } from "@/app/verify-email/actions";
import { INITIAL_AUTH_FORM_STATE } from "@/application/dto/AuthFormDTO";
import { Button, ButtonLink } from "@/presentation/components/shared/Button";
import { Checkbox, TextInput } from "@/presentation/components/shared/FormField";
import { PasswordField } from "./PasswordField";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, INITIAL_AUTH_FORM_STATE);
  const errors = state.fieldErrors ?? {};

  const isUnverified = errors.email === "email-belum-diverifikasi";

  if (state.status === "success") return <SuccessState message={state.message} />;

  return (
    <form action={formAction}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.status === "error" && !isUnverified && <p className="mb-5 rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container" role="alert">{state.message}</p>}
      {isUnverified && <UnverifiedAlert />}
      <TextInput id="email" name="email" label="Email" type="email" required autoComplete="email" placeholder="nama@email.com" error={errors.email === "email-belum-diverifikasi" ? undefined : errors.email} />
      <div className="mt-5"><PasswordField id="password" name="password" label="Password" autoComplete="current-password" error={errors.password} /></div>
      <div className="mt-4 flex items-center justify-between gap-4"><Checkbox id="rememberMe" name="rememberMe" label="Ingat saya" className="text-label-sm" /><Link href="/bantuan" className="text-label-sm font-label-sm text-primary hover:underline">Lupa password?</Link></div>
      <Button type="submit" loading={pending} className="mt-7 w-full py-3">{pending ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Memproses...</> : "Masuk"}</Button>
      <p className="mt-6 text-center text-body-md text-on-surface-variant">Belum punya akun? <Link href="/daftar" className="font-semibold text-primary hover:underline">Daftar sekarang</Link></p>
    </form>
  );
}

function UnverifiedAlert() {
  const [pending, startTransition] = useTransition();
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    startTransition(async () => {
      setResent(false);
      const emailInput = document.getElementById("email") as HTMLInputElement | null;
      const email = emailInput?.value?.trim() ?? "";
      if (!email) return;
      await resendVerificationEmailAction(email);
      setResent(true);
    });
  };

  return (
    <div className="mb-5 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3" role="alert">
      <div className="flex items-start gap-2">
        <MailQuestion className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <p className="text-body-md font-medium text-amber-900">Email belum diverifikasi</p>
          <p className="mt-1 text-label-sm text-amber-800">Silakan periksa kotak masuk email Anda dan klik tautan verifikasi. Belum menerima email?</p>
          <Button type="button" onClick={handleResend} disabled={pending} variant="secondary" size="sm" className="mt-2 bg-status-warning-container text-status-warning hover:bg-status-warning-container/80">
            {pending ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" />Mengirim...</> : "Kirim ulang email verifikasi"}
          </Button>
          {resent && <p className="mt-2 text-label-sm text-amber-700">Email verifikasi telah dikirim ulang. Periksa kotak masuk Anda.</p>}
        </div>
      </div>
    </div>
  );
}

function SuccessState({ message }: { message?: string }) {
  return <div className="rounded-xl border border-primary/20 bg-primary/5 p-7 text-center" role="status"><CheckCircle2 className="mx-auto h-11 w-11 text-primary" aria-hidden="true" /><h2 className="mt-4 text-headline-md font-headline-md text-on-surface">Data masuk valid</h2><p className="mt-3 text-body-md leading-6 text-on-surface-variant">{message}</p><ButtonLink href="/" className="mt-6 px-5 py-3">Kembali ke Beranda</ButtonLink></div>;
}
