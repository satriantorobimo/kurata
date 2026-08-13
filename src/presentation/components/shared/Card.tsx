import { cn } from "@/lib/cn";

interface CardProps extends React.ComponentPropsWithoutRef<"section"> { padded?: boolean; }

export function Card({ children, className, padded = true, ...props }: CardProps) {
  return <section className={cn("rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card", padded && "p-6", className)} {...props}>{children}</section>;
}

interface CardHeaderProps { title: string; description?: string; action?: React.ReactNode; className?: string; }

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return <div className={cn("mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center", className)}><div><h2 className="text-headline-sm font-headline-sm text-on-surface">{title}</h2>{description ? <p className="mt-1 text-body-md text-on-surface-variant">{description}</p> : null}</div>{action}</div>;
}
