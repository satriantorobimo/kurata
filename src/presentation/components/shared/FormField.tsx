"use client";

import { cn } from "@/lib/cn";

export const controlClassName = "mt-2 w-full rounded-lg border border-border-subtle bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-on-surface-variant aria-[invalid=true]:border-error";

interface BaseFieldProps { id: string; label: string; required?: boolean; hint?: string; error?: string; className?: string; }

function FieldLabel({ id, label, required }: Pick<BaseFieldProps, "id" | "label" | "required">) {
  return <label htmlFor={id} className="text-label-md font-label-md text-on-surface">{label}{required ? <span className="text-error"> *</span> : null}</label>;
}

function FieldMessages({ id, hint, error }: Pick<BaseFieldProps, "id" | "hint" | "error">) {
  if (error) return <p id={`${id}-error`} className="mt-1.5 text-label-sm text-error" role="alert">{error}</p>;
  return hint ? <p id={`${id}-hint`} className="mt-1.5 text-label-sm text-on-surface-variant">{hint}</p> : null;
}

export function inputAriaProps(id: string, error?: string, hint?: string) {
  return { "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined };
}

export interface TextInputProps extends BaseFieldProps, Omit<React.ComponentPropsWithoutRef<"input">, "id" | "name" | "className"> { name: string; }

export function TextInput({ id, name, label, required, hint, error, className, ...props }: TextInputProps) {
  return <div className={className}><FieldLabel id={id} label={label} required={required} /><input id={id} name={name} required={required} className={controlClassName} {...inputAriaProps(id, error, hint)} {...props} /><FieldMessages id={id} hint={hint} error={error} /></div>;
}

export interface SelectInputProps extends BaseFieldProps, Omit<React.ComponentPropsWithoutRef<"select">, "id" | "name" | "className" | "children"> { name: string; options: { value: string; label: string }[]; placeholder?: string; }

export function SelectInput({ id, name, label, required, hint, error, className, options, placeholder = "Pilih salah satu", ...props }: SelectInputProps) {
  return <div className={className}><FieldLabel id={id} label={label} required={required} /><select id={id} name={name} required={required} defaultValue="" className={controlClassName} {...inputAriaProps(id, error, hint)} {...props}><option value="" disabled>{placeholder}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><FieldMessages id={id} hint={hint} error={error} /></div>;
}

export interface TextAreaProps extends BaseFieldProps, Omit<React.ComponentPropsWithoutRef<"textarea">, "id" | "name" | "className"> { name: string; }

export function TextArea({ id, name, label, required, hint, error, className, ...props }: TextAreaProps) {
  return <div className={className}><FieldLabel id={id} label={label} required={required} /><textarea id={id} name={name} required={required} className={cn(controlClassName, "resize-y")} {...inputAriaProps(id, error, hint)} {...props} /><FieldMessages id={id} hint={hint} error={error} /></div>;
}

export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<"input">, "id" | "name" | "type" | "className"> { id: string; name: string; label: React.ReactNode; error?: string; className?: string; }

export function Checkbox({ id, name, label, error, className, ...props }: CheckboxProps) {
  return <div className={className}><label className={cn("flex cursor-pointer items-start gap-3 text-body-md leading-6", error ? "text-error" : "text-on-surface-variant")}><input id={id} name={name} type="checkbox" className="mt-1 h-4 w-4 shrink-0 rounded border-outline text-primary focus:ring-primary" {...inputAriaProps(id, error)} {...props} /><span>{label}</span></label><FieldMessages id={id} error={error} /></div>;
}
