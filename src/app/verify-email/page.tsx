import { CheckCircle2, ShieldX } from "lucide-react";
import Link from "next/link";
import { verifyEmailTokenAction } from "./actions";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-container-lowest p-8 text-center shadow-card">
          <ShieldX className="mx-auto h-12 w-12 text-error" aria-hidden="true" />
          <h1 className="mt-4 text-headline-md font-headline-md text-on-surface">Tautan tidak valid</h1>
          <p className="mt-3 text-body-md leading-6 text-on-surface-variant">Tidak ada token verifikasi yang diberikan.</p>
          <Link href="/masuk" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary">Ke Halaman Masuk</Link>
        </div>
      </main>
    );
  }

  const result = await verifyEmailTokenAction(token);

  if (!result.ok) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-container-lowest p-8 text-center shadow-card">
          <ShieldX className="mx-auto h-12 w-12 text-error" aria-hidden="true" />
          <h1 className="mt-4 text-headline-md font-headline-md text-on-surface">Verifikasi gagal</h1>
          <p className="mt-3 text-body-md leading-6 text-on-surface-variant">{result.message}</p>
          <Link href="/masuk" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary">Ke Halaman Masuk</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-headline-md font-headline-md text-on-surface">Email terverifikasi</h1>
        <p className="mt-3 text-body-md leading-6 text-on-surface-variant">{result.message}</p>
        <Link href="/masuk" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-label-md font-label-md text-on-primary">Masuk ke akun</Link>
      </div>
    </main>
  );
}
