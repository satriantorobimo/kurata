"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/presentation/components/shared/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { document.title = "Terjadi Gangguan | Kurata"; }, []);
  return <html lang="id"><body className="min-h-dvh bg-background"><main className="flex min-h-dvh items-center justify-center px-6"><div className="max-w-lg rounded-2xl border border-border-subtle bg-surface-container-lowest p-8 text-center shadow-card"><AlertTriangle className="mx-auto h-11 w-11 text-error" aria-hidden="true" /><h1 className="mt-4 text-headline-md font-headline-md text-on-surface">Terjadi gangguan</h1><p className="mt-3 text-body-md leading-6 text-on-surface-variant">Kami tidak dapat memuat halaman ini. Silakan coba lagi.</p>{error.digest ? <p className="mt-2 text-label-sm text-outline">Referensi: {error.digest}</p> : null}<Button onClick={reset} className="mt-6 px-5 py-3">Coba lagi</Button></div></main></body></html>;
}
