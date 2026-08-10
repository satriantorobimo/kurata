import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karir | Kurata",
  description: "Bergabunglah dengan tim Kurata dan bangun masa depan investasi tanah bersama kami.",
};

export default function KarirPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary pb-16 pt-28 text-on-primary md:pb-20 md:pt-36">
        <div className="container-main">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Karir</h1>
          <p className="mt-4 max-w-2xl text-body-md leading-7 text-on-primary/75">
            Bergabunglah dengan tim Kurata dan bangun masa depan investasi tanah
            bersama kami.
          </p>
        </div>
      </section>
      <section className="container-main py-16 md:py-20">
        <p className="text-body-md leading-7 text-on-surface-variant">
          Halaman ini sedang dalam pengembangan. Lowongan dan informasi karir
          akan segera tersedia.
        </p>
      </section>
    </div>
  );
}
