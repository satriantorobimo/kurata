interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-body-md leading-6 text-on-surface-variant">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}