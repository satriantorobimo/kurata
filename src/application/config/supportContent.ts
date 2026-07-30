import type { SupportCategory } from "../../domain/entities/SupportRequest";

export interface SupportCategoryDefinition {
  id: SupportCategory;
  title: string;
  description: string;
}

export interface SupportFaq {
  id: string;
  category: SupportCategory;
  question: string;
  answer: string;
}

export const SUPPORT_CATEGORY_LABELS: Record<SupportCategory, string> = {
  "account-security": "Akun & Keamanan",
  "search-listings": "Mencari Tanah",
  "listing-information": "Informasi Listing",
  investment: "Layanan Investasi",
  "broker-partner": "Broker Partner",
  "kurata-services": "Layanan Kurata",
  "privacy-data": "Privasi & Data",
};

export const SUPPORT_CATEGORIES_CONTENT: SupportCategoryDefinition[] = [
  { id: "account-security", title: "Akun & Keamanan", description: "Bantuan masuk, pendaftaran, dan keamanan informasi akun." },
  { id: "search-listings", title: "Mencari Tanah", description: "Panduan menggunakan pencarian, filter, dan halaman detail." },
  { id: "listing-information", title: "Informasi Listing", description: "Memahami informasi yang tampil pada sebuah properti." },
  { id: "investment", title: "Layanan Investasi", description: "Pertanyaan tentang eksplorasi kebutuhan investasi tanah." },
  { id: "broker-partner", title: "Broker Partner", description: "Informasi pendaftaran dan program kemitraan broker." },
  { id: "kurata-services", title: "Layanan Kurata", description: "Konsultasi awal, pemasaran, dan dukungan proses." },
  { id: "privacy-data", title: "Privasi & Data", description: "Cara aman mengirim informasi saat menggunakan Kurata." },
];

export const SUPPORT_FAQS: SupportFaq[] = [
  { id: "search-land", category: "search-listings", question: "Bagaimana cara mencari tanah di Kurata?", answer: "Gunakan halaman Cari Tanah untuk memasukkan lokasi atau kata kunci, lalu gunakan filter sertifikat, harga, luas, dan badge listing sesuai kebutuhan Anda." },
  { id: "property-detail", category: "search-listings", question: "Bagaimana cara membuka informasi sebuah properti?", answer: "Pilih kartu properti dari hasil pencarian atau rekomendasi. Halaman detail menampilkan galeri, fakta properti, dan informasi awal yang tersedia." },
  { id: "listing-verification", category: "listing-information", question: "Apakah informasi listing sudah merupakan verifikasi akhir?", answer: "Tidak. Informasi listing membantu tahap eksplorasi awal. Verifikasi dokumen, kondisi bidang, dan proses transaksi tetap perlu dilakukan bersama pihak atau profesional yang sesuai." },
  { id: "exclusive-broker", category: "listing-information", question: "Apa arti Exclusive Kurata dan Broker Partner?", answer: "Badge menunjukkan konteks jaringan atau kurasi listing. Keduanya tidak menggantikan pemeriksaan mandiri dan verifikasi profesional sebelum keputusan dibuat." },
  { id: "investment-guidance", category: "investment", question: "Apakah Layanan Investasi memberikan jaminan hasil?", answer: "Tidak. Layanan Investasi membantu memetakan kebutuhan dan eksplorasi awal. Nilai, likuiditas, dan hasil investasi dapat berubah, sehingga keputusan tetap berada pada Anda." },
  { id: "broker-registration", category: "broker-partner", question: "Bagaimana cara mendaftar menjadi Broker Partner?", answer: "Kunjungi halaman Untuk Broker, pelajari persyaratan, lalu isi formulir pendaftaran awal. Tim Kurata akan menggunakan informasi tersebut untuk proses peninjauan." },
  { id: "service-consultation", category: "kurata-services", question: "Apa yang perlu disiapkan untuk konsultasi awal?", answer: "Cukup siapkan konteks umum seperti tujuan, area, kebutuhan, dan kisaran anggaran atau harga. Jangan mengirim dokumen identitas atau kepemilikan melalui formulir awal." },
  { id: "password-recovery", category: "account-security", question: "Bagaimana jika saya lupa password?", answer: "Pemulihan password belum aktif karena akun Kurata masih dalam mode pengembangan. Gunakan formulir bantuan untuk memberi tahu kami kebutuhan Anda; jangan kirim password saat ini atau sebelumnya." },
  { id: "account-demo", category: "account-security", question: "Apakah akun saya sudah tersimpan setelah mendaftar?", answer: "Belum. Halaman Masuk dan Daftar saat ini memvalidasi formulir dalam mode demo, tetapi belum membuat akun atau sesi pengguna yang persisten." },
  { id: "sensitive-data", category: "privacy-data", question: "Informasi apa yang tidak boleh saya kirim?", answer: "Jangan kirim password, nomor identitas, foto KTP, sertifikat lengkap, atau dokumen sensitif melalui formulir publik. Dokumen hanya boleh dibagikan melalui proses aman ketika benar-benar diperlukan." },
];
