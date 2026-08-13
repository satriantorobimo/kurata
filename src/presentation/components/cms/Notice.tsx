"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";

import { cn } from "@/lib/cn";

type NoticeTone = "info" | "success" | "error";

interface NoticeProps {
  tone?: NoticeTone;
  message: string;
  onDismiss?: () => void;
}

const toneClasses: Record<NoticeTone, string> = {
  info: "border-primary/20 bg-primary/5 text-on-surface",
  success: "border-status-success bg-status-success-container text-status-success",
  error: "border-error/30 bg-error-container text-on-error-container",
};

const toneIcon: Record<NoticeTone, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: XCircle,
};

export function Notice({ tone = "info", message, onDismiss }: NoticeProps) {
  const Icon = toneIcon[tone];
  return (
    <div className={cn("mb-5 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-body-md", toneClasses[tone])} role="status">
      <span className="flex items-center gap-2.5">
        <Icon className={cn("h-5 w-5 shrink-0", tone === "success" && "text-primary", tone === "error" && "text-error")} aria-hidden="true" />
        <span>{message}</span>
      </span>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Tutup notifikasi" className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
