import { Handshake, Verified, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/presentation/components/shared/Button";

interface HighlightCardData {
  title: string;
  description: string;
  benefits: string[];
  ctaLabel: string;
  ctaHref: string;
  icon: "handshake" | "verified";
  imageSrc: string;
  imageAlt: string;
}

const HIGHLIGHT_CARDS: HighlightCardData[] = [
  {
    title: "Mitra Kurata",
    description: "Pasarkan tanah Anda melalui jaringan profesional Kurata.",
    benefits: [
      "Jangkauan Lebih Luas",
      "Proses Lebih Mudah",
      "Bersama Mitra Kurata Terpercaya",
    ],
    ctaLabel: "Jadi Mitra Kurata",
    ctaHref: "/untuk-broker",
    icon: "handshake",
    imageSrc: "/broker.png",
    imageAlt: "Ilustrasi Mitra Kurata",
  },
  {
    title: "Exclusive Kurata",
    description: "Listing pilihan yang telah diverifikasi langsung oleh tim Kurata.",
    benefits: [
      "Listing Terverifikasi",
      "Legalitas Terjamin",
      "Kualitas Terbaik",
    ],
    ctaLabel: "Lihat Listing",
    ctaHref: "/cari-tanah",
    icon: "verified",
    imageSrc: "/eksklusif.png",
    imageAlt: "Ilustrasi Exclusive Kurata",
  },
];

function HighlightCard({ card }: { card: HighlightCardData }) {
  const IconComponent = card.icon === "handshake" ? Handshake : Verified;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card p-8 flex flex-col md:flex-row items-center gap-6 group hover:shadow-card-hover transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>
          <h3 className="font-headline-md text-headline-md text-primary">
            {card.title}
          </h3>
        </div>
        <p className="text-body-md text-on-surface-variant mb-6">
          {card.description}
        </p>
        <ul className="space-y-2 mb-8">
          {card.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-2 text-label-md text-on-surface"
            >
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
        <Button variant="primary" size="md" href={card.ctaHref}>
          {card.ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg md:w-1/2">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
}

export function HighlightCards() {
  return (
    <section className="w-full container-main py-16 -mt-24 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {HIGHLIGHT_CARDS.map((card) => (
          <HighlightCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}
