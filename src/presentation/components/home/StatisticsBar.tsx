import {
  Compass,
  FileText,
  MessageCircle,
  Search,
  type LucideIcon,
} from "lucide-react";

interface BenefitItem {
  icon: LucideIcon;
  label: string;
  sublabel: string;
}

const BENEFIT_ITEMS: BenefitItem[] = [
  { icon: Search, label: "Cari Lebih Mudah", sublabel: "Filter sesuai kebutuhan" },
  { icon: FileText, label: "Informasi Lebih Jelas", sublabel: "Detail listing tersusun rapi" },
  { icon: MessageCircle, label: "Terhubung Langsung", sublabel: "Ajukan pertanyaan dengan mudah" },
  { icon: Compass, label: "Langkah Lebih Terarah", sublabel: "Panduan dari Kurata" },
];

function BenefitItemView({ item }: { item: BenefitItem }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center justify-center gap-4 px-4">
      <Icon className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <div className="text-label-md font-label-md text-on-surface">{item.label}</div>
        <div className="text-label-sm text-on-surface-variant">{item.sublabel}</div>
      </div>
    </div>
  );
}

export function StatisticsBar() {
  return (
    <section
      className="mb-section-gap w-full border-y border-border-subtle bg-surface-container-lowest py-8"
      aria-label="Manfaat Kurata"
    >
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border-subtle">
          {BENEFIT_ITEMS.map((item) => (
            <BenefitItemView key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
