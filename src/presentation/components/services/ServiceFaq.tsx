const FAQS = [
  ["Apakah layanan Kurata langsung mengurus seluruh transaksi?", "Kurata membantu mengarahkan kebutuhan, komunikasi, dan informasi awal. Tahap formal seperti pembuatan akta, pengecekan legal, atau pengukuran perlu ditangani oleh profesional dan pihak berwenang yang sesuai."],
  ["Apakah estimasi harga merupakan appraisal resmi?", "Tidak. Estimasi Kurata bersifat indikatif untuk membantu diskusi awal. Penilaian resmi harus dilakukan oleh penilai berlisensi sesuai kebutuhan Anda."],
  ["Informasi apa yang perlu saya siapkan untuk konsultasi awal?", "Lokasi atau area, tujuan Anda, kisaran anggaran atau harga, serta gambaran kebutuhan sudah cukup. Jangan kirim sertifikat, KTP, atau dokumen sensitif melalui formulir ini."],
  ["Berapa lama Kurata menanggapi permintaan saya?", "Waktu tanggapan bergantung pada kelengkapan informasi dan jenis kebutuhan. Setelah informasi awal ditinjau, tim akan mengabarkan langkah yang paling relevan."],
  ["Apakah ada biaya konsultasi?", "Cakupan dan biaya—jika ada—akan dijelaskan terlebih dahulu sebelum Anda melanjutkan ke layanan yang memerlukannya."],
];

export function ServiceFaq() {
  return (
    <section className="container-main py-16 md:py-20" aria-labelledby="service-faq-title">
      <div className="max-w-2xl"><p className="text-label-sm font-label-sm uppercase tracking-wider text-primary">Pertanyaan umum</p><h2 id="service-faq-title" className="mt-2 text-3xl font-bold text-on-surface">Hal yang Perlu Anda Ketahui</h2></div>
      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {FAQS.map(([question, answer]) => <details key={question} className="group rounded-xl border border-border-subtle bg-surface-container-lowest px-5 py-4"><summary className="cursor-pointer list-none pr-8 text-label-md font-label-md text-on-surface marker:hidden">{question}<span className="float-right -mr-7 text-xl text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p className="pt-3 text-body-md leading-6 text-on-surface-variant">{answer}</p></details>)}
      </div>
    </section>
  );
}
