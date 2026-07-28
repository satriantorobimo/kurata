import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, UsersRound } from "lucide-react";
import { BrokerBenefits } from "@/presentation/components/broker/BrokerBenefits";
import { BrokerFaq } from "@/presentation/components/broker/BrokerFaq";
import { BrokerHero } from "@/presentation/components/broker/BrokerHero";
import { BrokerProcess } from "@/presentation/components/broker/BrokerProcess";
import { BrokerRegistrationForm } from "@/presentation/components/broker/BrokerRegistrationForm";

export const metadata: Metadata = {
  title: "Untuk Broker | Kurata",
  description: "Bergabunglah sebagai Broker Partner Kurata dan kembangkan pemasaran properti Anda bersama jaringan profesional.",
  openGraph: {
    title: "Untuk Broker | Kurata",
    description: "Program kemitraan Kurata untuk broker properti yang ingin tumbuh secara profesional dan transparan.",
  },
};

const REQUIREMENTS = [
  "Berusia minimal 18 tahun dan memiliki identitas kontak yang aktif.",
  "Memiliki pengalaman atau minat serius dalam pemasaran properti tanah.",
  "Menyampaikan informasi listing secara akurat, jelas, dan bertanggung jawab.",
  "Bersedia mengikuti panduan kemitraan dan proses verifikasi Kurata.",
];

export default function BrokerPage() {
  return (
    <div className="min-h-screen bg-background">
      <BrokerHero />
      <BrokerBenefits />
      <BrokerProcess />

      <section className="container-main py-16 md:py-20" aria-labelledby="broker-requirements-title">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-2xl bg-primary p-8 text-on-primary sm:p-10">
            <UsersRound className="mb-6 h-10 w-10 text-on-primary-container" aria-hidden="true" />
            <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-primary-container">Untuk broker yang siap bertumbuh</p>
            <h2 id="broker-requirements-title" className="mt-3 text-3xl font-bold leading-tight">Kemitraan Dibangun dengan Kejelasan dan Kepercayaan</h2>
            <p className="mt-5 leading-7 text-on-primary/80">Kurata membantu mempertemukan kualitas listing, proses komunikasi yang baik, dan broker yang berkomitmen terhadap informasi pertanahan yang transparan.</p>
          </div>
          <div>
            <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">Syarat pendaftaran</p>
            <h3 className="text-3xl font-bold text-on-surface">Siapa yang Dapat Bergabung?</h3>
            <ul className="mt-7 space-y-4">
              {REQUIREMENTS.map((requirement) => (
                <li key={requirement} className="flex gap-3 text-body-md leading-6 text-on-surface-variant"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="pendaftaran" className="scroll-mt-24 bg-surface-container-low py-16 md:py-20" aria-labelledby="broker-registration-title">
        <div className="container-main grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-2 text-label-sm font-label-sm uppercase tracking-wider text-primary">Mulai kemitraan</p>
            <h2 id="broker-registration-title" className="text-3xl font-bold text-on-surface">Daftar Menjadi Broker Partner</h2>
            <p className="mt-4 text-body-md leading-7 text-on-surface-variant">Kirim informasi awal Anda. Tim Kurata akan menggunakan data ini sebagai dasar peninjauan dan proses onboarding berikutnya.</p>
            <div className="mt-7 rounded-xl border border-primary/15 bg-surface-container-lowest p-5">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="text-label-md font-label-md text-on-surface">Privasi dan keamanan data</h3><p className="mt-1 text-label-sm leading-5 text-on-surface-variant">Hanya kirim data kontak dan profil profesional. Dokumen sensitif akan diminta melalui proses aman bila memang diperlukan.</p></div></div>
            </div>
          </div>
          <BrokerRegistrationForm />
        </div>
      </section>

      <BrokerFaq />
    </div>
  );
}
