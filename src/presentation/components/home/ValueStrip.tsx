import {
  ShieldCheck,
  Shield,
  ScrollText,
  BadgeCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

interface ValueItem {
  icon: LucideIcon;
  label: string;
  sublabel: string;
}

const VALUE_ITEMS: ValueItem[] = [
  { icon: ShieldCheck, label: "Terpercaya", sublabel: "Data terverifikasi" },
  { icon: Shield, label: "Aman", sublabel: "Transaksi terlindungi" },
  { icon: ScrollText, label: "Transparan", sublabel: "Informasi jelas" },
  { icon: BadgeCheck, label: "Profesional", sublabel: "Broker berpengalaman" },
  { icon: Users, label: "Untuk Semua", sublabel: "Pemilik, Broker, Investor" },
];

export function ValueStrip() {
  return (
    <section className="w-full bg-secondary-fixed/50 py-12 mb-section-gap">
      <div className="container-main">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-8">
          {VALUE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <Icon className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <div className="font-label-md text-on-surface">
                    {item.label}
                  </div>
                  <div className="text-label-sm text-on-surface-variant">
                    {item.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
