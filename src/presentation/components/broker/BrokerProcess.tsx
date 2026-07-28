import { CheckCircle2, ClipboardPenLine, Handshake, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ClipboardPenLine, title: "Kirim Pendaftaran", description: "Lengkapi informasi dasar mengenai profil dan area operasional Anda." },
  { icon: CheckCircle2, title: "Tinjauan Awal", description: "Tim Kurata meninjau kelengkapan data pendaftaran Anda." },
  { icon: Handshake, title: "Onboarding", description: "Pelajari panduan kemitraan dan standar informasi listing." },
  { icon: Rocket, title: "Mulai Berkembang", description: "Bangun portofolio dan peluang kolaborasi bersama jaringan Kurata." },
];

export function BrokerProcess() {
  return (
    <section id="cara-kerja" className="bg-secondary-fixed/45 py-16 md:py-20" aria-labelledby="broker-process-title">
      <div className="container-main">
        <div className="max-w-2xl">
          <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">Cara kerja</p>
          <h2 id="broker-process-title" className="text-3xl font-bold text-on-surface">Mulai dalam Empat Langkah</h2>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative rounded-xl bg-surface-container-lowest p-6 shadow-card">
                <span className="absolute right-5 top-5 text-4xl font-bold text-primary/10">0{index + 1}</span>
                <Icon className="mb-5 h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="text-headline-sm font-headline-sm text-on-surface">{step.title}</h3>
                <p className="mt-2 text-body-md leading-6 text-on-surface-variant">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
