"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({ id, name, label, error, autoComplete, hint, value, onChange }: { id: string; name: string; label: string; error?: string; autoComplete: "current-password" | "new-password"; hint?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-label-md font-label-md text-on-surface">{label} <span className="text-error">*</span></label>
      {hint && <p className="mt-1 text-label-sm leading-5 text-on-surface-variant">{hint}</p>}
      <div className="relative mt-2">
        <input id={id} name={name} type={visible ? "text" : "password"} required minLength={8} autoComplete={autoComplete} value={value} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-3 pr-11 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error" />
        <button type="button" onClick={() => setVisible((current) => !current)} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-outline transition-colors hover:text-primary" aria-label={visible ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}>{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-label-sm text-error" role="alert">{error}</p>}
    </div>
  );
}
