import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privasi | Kurata",
  description: "Kebijakan privasi Kurata mengenai pengumpulan, penggunaan, dan perlindungan data pribadi Anda.",
};

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary pb-16 pt-28 text-on-primary md:pb-20 md:pt-36">
        <div className="container-main">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Kebijakan Privasi</h1>
          <p className="mt-4 max-w-2xl text-body-md leading-7 text-on-primary/75">
            Kebijakan privasi Kurata mengenai pengumpulan, penggunaan, dan
            perlindungan data pribadi Anda.
          </p>
        </div>
      </section>
      <section className="container-main py-16 md:py-20">
        <p className="text-body-md leading-7 text-on-surface-variant">
          Halaman ini sedang dalam pengembangan. Kebijakan privasi lengkap akan
          segera tersedia.
        </p>
      </section>
    </div>
  );
}
