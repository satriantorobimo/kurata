"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { controlClassName, inputAriaProps } from "@/presentation/components/shared/FormField";
import { IconButton } from "@/presentation/components/shared/Button";

export function PasswordField({ id, name, label, error, autoComplete, hint, value, onChange }: { id: string; name: string; label: string; error?: string; autoComplete: "current-password" | "new-password"; hint?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="text-label-md font-label-md text-on-surface">{label} <span className="text-error">*</span></label>
      {hint && <p className="mt-1 text-label-sm leading-5 text-on-surface-variant">{hint}</p>}
      <div className="relative mt-2">
        <input id={id} name={name} type={visible ? "text" : "password"} required minLength={8} autoComplete={autoComplete} value={value} onChange={onChange} {...inputAriaProps(id, error, hint)} className={`${controlClassName} mt-0 pr-11`} />
        <IconButton type="button" onClick={() => setVisible((current) => !current)} className="absolute inset-y-0 right-0 h-auto w-11 rounded-none border-0 bg-transparent text-outline hover:bg-transparent hover:text-primary" label={visible ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}>{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</IconButton>
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-label-sm text-error" role="alert">{error}</p>}
    </div>
  );
}
