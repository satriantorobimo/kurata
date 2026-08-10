import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
      {Icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      ) : null}
      <h3 className="mt-4 text-headline-sm font-headline-sm text-on-surface">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-body-md leading-6 text-on-surface-variant">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}