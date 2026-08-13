interface PageHeroProps { title: string; description: string; }

export function PageHero({ title, description }: PageHeroProps) {
  return <section className="bg-primary pb-16 pt-28 text-on-primary md:pb-20 md:pt-36"><div className="container-main"><h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-body-md leading-7 text-on-primary/75">{description}</p></div></section>;
}

export function PagePlaceholder({ children }: { children: React.ReactNode }) {
  return <section className="container-main py-16 md:py-20"><div className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 text-body-md leading-7 text-on-surface-variant shadow-card sm:p-8">{children}</div></section>;
}
