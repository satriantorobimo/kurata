"use client";

import { cn } from "@/lib/cn";

const inputClasses =
  "mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md font-normal text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-error";

interface SharedFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

function FieldErrorMessage({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-label-sm text-error" role="alert">
      {error}
    </p>
  );
}

export function FieldLabel({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="text-label-md font-label-md text-on-surface">
      {label}
      {required ? <span className="text-error"> *</span> : null}
    </label>
  );
}

interface TextInputProps extends SharedFieldProps {
  name: string;
  type?: "text" | "email" | "number" | "url" | "tel" | "date" | "password";
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextInput({ id, label, name, required, error, hint, type = "text", value, defaultValue, placeholder, autoComplete, disabled, onChange }: TextInputProps) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(inputClasses, disabled && "cursor-not-allowed bg-surface-container-low text-on-surface-variant")}
      />
      {hint && !error ? <p id={`${id}-hint`} className="mt-1.5 text-label-sm text-on-surface-variant">{hint}</p> : null}
      <FieldErrorMessage id={id} error={error} />
    </div>
  );
}

interface SelectProps extends SharedFieldProps {
  name: string;
  value?: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function SelectInput({ id, label, name, required, error, hint, value, defaultValue, options, disabled }: SelectProps) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <select id={id} name={name} value={value} defaultValue={defaultValue} required={required} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} className={cn(inputClasses, disabled && "cursor-not-allowed bg-surface-container-low text-on-surface-variant")}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error ? <p id={`${id}-hint`} className="mt-1.5 text-label-sm text-on-surface-variant">{hint}</p> : null}
      <FieldErrorMessage id={id} error={error} />
    </div>
  );
}

interface TextAreaProps extends SharedFieldProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({ id, label, name, required, error, hint, value, defaultValue, placeholder, rows = 4, onChange }: TextAreaProps) {
  return (
    <div>
      <FieldLabel id={id} label={label} required={required} />
      <textarea id={id} name={name} value={value} defaultValue={defaultValue} placeholder={placeholder} rows={rows} required={required} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} className={inputClasses} />
      {hint && !error ? <p id={`${id}-hint`} className="mt-1.5 text-label-sm text-on-surface-variant">{hint}</p> : null}
      <FieldErrorMessage id={id} error={error} />
    </div>
  );
}

interface CheckboxProps extends SharedFieldProps {
  name: string;
  checked?: boolean;
  defaultValue?: boolean;
  disabled?: boolean;
}

export function Checkbox({ id, label, name, required, error, checked, defaultValue, disabled }: CheckboxProps) {
  return (
    <div>
      <label className={cn("flex items-start gap-2.5 text-label-sm", disabled ? "cursor-not-allowed text-on-surface-variant/60" : "text-on-surface-variant cursor-pointer")}>
        <input id={id} name={name} type="checkbox" checked={checked} defaultChecked={defaultValue} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary" />
        <span className={cn("font-normal", required && "text-on-surface")}>
          {label}
          {required ? <span className="text-error"> *</span> : null}
        </span>
      </label>
      <FieldErrorMessage id={id} error={error} />
    </div>
  );
}
