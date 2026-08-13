"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";

import { initializeInvestasiSectionAction } from "@/app/cms/actions";

export function InitializeInvestasiSectionButton({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const initialize = () => {
    setError("");
    startTransition(async () => {
      const result = await initializeInvestasiSectionAction(sectionId);
      if (!result.ok) {
        setError(result.message ?? "Segmen tidak dapat disiapkan.");
        return;
      }
      router.push(`/cms/investasi/${sectionId.replace("investasi-", "")}`);
      router.refresh();
    });
  };

  return (
    <div>
      <button type="button" onClick={initialize} disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-label-md text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65">
        {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Menyiapkan..." : "Siapkan konten"}
      </button>
      {error ? <p className="mt-2 text-label-sm text-error" role="alert">{error}</p> : null}
    </div>
  );
}
