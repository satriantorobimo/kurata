"use client";

import { LoaderCircle, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/cn";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  pending?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Hapus", pending, danger = true, onConfirm, onClose }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", danger ? "bg-error-container text-on-error-container" : "bg-primary/10 text-primary")}>
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-headline-sm font-headline-sm text-on-surface">{title}</h2>
              {description ? <p className="mt-1.5 text-body-md leading-6 text-on-surface-variant">{description}</p> : null}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="shrink-0 rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle px-4 py-2.5 text-label-md font-label-md text-on-surface transition-colors hover:bg-surface-container-low">
            Batal
          </button>
          <button type="button" onClick={onConfirm} disabled={pending} className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-label-md font-label-md transition-colors disabled:cursor-not-allowed disabled:opacity-65", danger ? "bg-error text-on-error hover:bg-error/90" : "bg-primary text-on-primary hover:bg-primary/90")}>
            {pending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {pending ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}