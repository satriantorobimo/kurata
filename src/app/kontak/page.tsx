import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak | Kurata",
  description: "Hubungi tim Kurata untuk pertanyaan, bantuan, atau kerja sama.",
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary pb-16 pt-28 text-on-primary md:pb-20 md:pt-36">
        <div className="container-main">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Kontak</h1>
          <p className="mt-4 max-w-2xl text-body-md leading-7 text-on-primary/75">
            Hubungi tim Kurata untuk pertanyaan, bantuan, atau kerja sama.
          </p>
        </div>
      </section>
      <section className="container-main py-16 md:py-20">
        <p className="text-body-md leading-7 text-on-surface-variant">
          Halaman ini sedang dalam pengembangan. Informasi kontak lengkap akan
          segera tersedia.
        </p>
      </section>
    </div>
  );
}
