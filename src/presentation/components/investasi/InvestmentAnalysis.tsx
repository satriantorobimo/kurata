import { Building2, CheckCircle2, CircleDollarSign, Landmark, Navigation, Star, TrendingUp, Truck, Car, ArrowLeftRight, MoveHorizontal, Factory } from "lucide-react";

import type { InvestasiContent } from "@/application/use-cases/GetInvestasiContent";

const FEATURE_ICONS = { ArrowLeftRight, MoveHorizontal, Truck, Factory, Car };

export function InvestmentAnalysis({ content, title }: { content: InvestasiContent; title: string }) {
  return <>
    <section aria-labelledby="potential-reasons" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8">
      <p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Analisis Potensi</p>
      <h2 id="potential-reasons" className="mt-2 text-headline-md font-headline-md text-on-surface">Kenapa {title} Berpotensi?</h2>
      <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {content.features.map(({ icon, label }) => {
          const Icon = FEATURE_ICONS[icon as keyof typeof FEATURE_ICONS] ?? Building2;
          return <div key={label} className="flex flex-col items-center gap-3 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span><span className="text-label-md font-label-md text-on-surface">{label}</span></div>;
        })}
      </div>
    </section>

    <section className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><h2 className="flex items-center gap-2 text-headline-sm font-headline-sm text-on-surface"><CircleDollarSign className="h-5 w-5 text-primary" />Peluang Bisnis</h2><ul className="mt-4 space-y-3">{content.opportunities.map((item) => <li key={item} className="flex gap-2 text-body-md leading-6 text-on-surface-variant"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul></article>
      <article className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><h2 className="flex items-center gap-2 text-headline-sm font-headline-sm text-on-surface"><TrendingUp className="h-5 w-5 text-primary" />Analisis Wilayah</h2><ul className="mt-4 space-y-3">{content.areaAnalysis.map(({ label, rating }) => <li key={label} className="flex items-center justify-between gap-3 text-body-md"><span className="text-on-surface-variant">{label}</span><span className="flex gap-0.5">{[1,2,3,4,5].map((index) => <Star key={index} className={`h-4 w-4 ${index <= rating ? "fill-primary text-primary" : "text-outline-variant"}`} />)}</span></li>)}</ul></article>
      <article className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><h2 className="flex items-center gap-2 text-headline-sm font-headline-sm text-on-surface"><Landmark className="h-5 w-5 text-primary" />Infrastruktur Sekitar</h2><ul className="mt-4 space-y-3">{content.infrastructure.map(({ label, distance }) => <li key={label} className="flex items-center justify-between gap-3 text-body-md"><span className="text-on-surface-variant">{label}</span><span className="flex shrink-0 items-center gap-1 font-label-md text-on-surface"><Navigation className="h-3.5 w-3.5 text-primary" />{distance}</span></li>)}</ul></article>
    </section>

    <section className="rounded-xl bg-surface-container-low p-6 sm:p-8"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Insight Kurata</p><h2 className="mt-2 text-headline-md font-headline-md text-on-surface">{content.insightTitle}</h2><p className="mt-3 max-w-3xl text-body-md leading-7 text-on-surface-variant">{content.insightDescription}</p></section>

    <section aria-labelledby="potential-score" className="rounded-xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card sm:p-8"><div className="flex flex-wrap items-end gap-3"><div><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Penilaian Kurata</p><h2 id="potential-score" className="mt-2 text-headline-md font-headline-md text-on-surface">Skor Potensi Lahan</h2></div><span className="ml-auto text-4xl font-bold text-primary">{content.score.toFixed(1)}<span className="text-label-md font-normal text-on-surface-variant"> / 5</span></span></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{content.scoreMetrics.map(({ label, score }) => <div key={label}><div className="flex justify-between text-label-md"><span className="text-on-surface">{label}</span><span className="text-on-surface-variant">{score.toFixed(1)}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-primary" style={{ width: `${score * 20}%` }} /></div></div>)}</div></section>
  </>;
}
