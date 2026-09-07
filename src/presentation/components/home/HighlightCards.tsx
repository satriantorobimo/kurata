import { Plus, UsersRound } from "lucide-react";
import Image from "next/image";
import { Button } from "@/presentation/components/shared/Button";

export function HighlightCards() {
  return (
    <section
      className="container-main relative z-20 w-full pb-10 pt-2 md:pb-12 md:pt-3"
      aria-labelledby="broker-highlight-title"
    >
      <article className="group overflow-hidden rounded-[1.5rem] border border-[#e6d46c] bg-[#fff4b8] shadow-card transition-shadow hover:shadow-card-hover">
        <div className="grid min-h-56 md:grid-cols-[16rem_minmax(0,1fr)_21rem] md:items-stretch">
          <div className="relative min-h-52 overflow-hidden md:min-h-56">
            <Image
              src="/mitra-kurata-banner.png"
              alt="Mitra Kurata memeriksa data tanah melalui ponsel"
              fill
              sizes="(min-width: 768px) 16rem, 100vw"
              className="object-cover object-[48%_68%] transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-7 md:px-8 md:py-8 lg:px-10">
            <p className="text-label-md font-label-md text-[#17231b]">
              Untuk Mitra / Broker
            </p>
            <h2
              id="broker-highlight-title"
              className="mt-2 max-w-xl text-2xl font-bold leading-tight tracking-tight text-primary md:text-3xl"
            >
              Punya Tanah atau
              <br className="hidden sm:block" /> Membawa Listing?
            </h2>
            <p className="mt-3 max-w-xl text-body-md leading-6 text-[#38443b] md:text-base">
              Masukkan data tanah dalam 2 menit dan biarkan Kurata membantu
              memasarkannya.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 px-6 pb-7 md:px-7 md:py-8 md:pr-8">
            <Button
              href="/broker/assets/new"
              size="lg"
              className="min-h-14 w-full whitespace-nowrap rounded-xl"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              Input Tanah Sekarang
            </Button>
            <Button
              href="/untuk-broker"
              variant="outline"
              size="lg"
              className="min-h-14 w-full whitespace-nowrap rounded-xl border-2 bg-transparent"
            >
              <UsersRound className="h-5 w-5" aria-hidden="true" />
              Jadi Mitra Kurata
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}
