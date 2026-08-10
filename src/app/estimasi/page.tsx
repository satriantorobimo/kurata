import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estimasi Harga | Kurata",
  description: "Estimasi harga tanah berdasarkan data pasar dan analisis lokasi.",
};

export default function EstimasiPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary pb-16 pt-28 text-on-primary md:pb-20 md:pt-36">
        <div className="container-main">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Estimasi Harga</h1>
          <p className="mt-4 max-w-2xl text-body-md leading-7 text-on-primary/75">
            Estimasi harga tanah berdasarkan data pasar dan analisis lokasi.
          </p>
        </div>
      </section>
      <section className="container-main py-16 md:py-20">
        <p className="text-body-md leading-7 text-on-surface-variant">
          Halaman ini sedang dalam pengembangan. Fitur estimasi harga akan segera
          tersedia.
        </p>
      </section>
    </div>
  );
}
