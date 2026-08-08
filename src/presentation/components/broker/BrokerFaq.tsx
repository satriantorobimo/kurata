const QUESTIONS = [
  { question: "Apakah pendaftaran Mitra Kurata berbayar?", answer: "Pendaftaran awal tidak dipungut biaya. Ketentuan layanan lanjutan akan diinformasikan secara transparan saat onboarding." },
  { question: "Apakah Mitra Kurata independen dapat mendaftar?", answer: "Ya. Mitra Kurata independen maupun yang tergabung dalam agency dapat mengajukan pendaftaran." },
  { question: "Berapa lama proses peninjauan pendaftaran?", answer: "Waktu peninjauan bergantung pada kelengkapan data dan proses verifikasi yang dibutuhkan." },
  { question: "Apakah saya dapat mendaftarkan lebih dari satu area?", answer: "Ya. Jelaskan seluruh area operasional utama Anda di formulir pendaftaran." },
];

export function BrokerFaq() {
  return (
    <section className="container-main py-16 md:py-20" aria-labelledby="broker-faq-title">
      <div className="max-w-2xl">
        <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">Pertanyaan umum</p>
        <h2 id="broker-faq-title" className="text-3xl font-bold text-on-surface">Hal yang Perlu Diketahui</h2>
      </div>
      <div className="mt-8 divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface-container-lowest px-6">
        {QUESTIONS.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="cursor-pointer list-none pr-8 text-label-md font-label-md text-on-surface marker:hidden">{item.question}</summary>
            <p className="pt-3 text-body-md leading-6 text-on-surface-variant">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
