import Link from "next/link";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

interface SharedButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

interface ButtonProps extends SharedButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
type ButtonLinkProps = SharedButtonProps & Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof SharedButtonProps>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary shadow-sm hover:opacity-90",
  secondary: "bg-surface-container-low text-on-surface hover:bg-surface-container",
  ghost: "text-primary hover:bg-primary/5",
  outline: "border border-primary text-primary hover:bg-primary/5",
  danger: "bg-error text-on-error shadow-sm hover:opacity-90",
  inverse: "bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-low",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-label-sm",
  md: "px-6 py-2 text-label-md",
  lg: "px-8 py-3 text-label-md",
};

function buttonClasses(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn("inline-flex items-center justify-center gap-2 rounded-lg font-label-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-65", variantClasses[variant], sizeClasses[size], className);
}

export function Button({ variant = "primary", size = "md", children, className, loading = false, href, onClick, disabled, type = "button" }: ButtonProps) {
  if (href) {
    return <Link href={href} onClick={onClick} className={buttonClasses(variant, size, className)} aria-busy={loading || undefined} aria-disabled={loading || undefined} tabIndex={loading ? -1 : undefined}>{children}</Link>;
  }

  return <button type={type} onClick={onClick} className={buttonClasses(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined}>{children}</button>;
}

export function ButtonLink({ variant = "primary", size = "md", children, className, loading = false, "aria-disabled": ariaDisabled, ...props }: ButtonLinkProps) {
  return <Link {...props} className={buttonClasses(variant, size, className)} aria-busy={loading || undefined} aria-disabled={ariaDisabled || loading || undefined} tabIndex={loading ? -1 : props.tabIndex}>{children}</Link>;
}

interface IconButtonProps extends Omit<React.ComponentPropsWithoutRef<"button">, "children"> { label: string; children: React.ReactNode; size?: "sm" | "md" | "lg"; }
const iconSizeClasses = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };

export function IconButton({ label, children, className, size = "md", type = "button", ...props }: IconButtonProps) {
  return <button type={type} aria-label={label} className={cn("inline-flex items-center justify-center rounded-full border border-border-subtle bg-surface-container-lowest text-on-surface transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-65", iconSizeClasses[size], className)} {...props}>{children}</button>;
}
