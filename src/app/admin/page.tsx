import type { Metadata } from "next";
import { AdminConsole } from "@/presentation/components/admin/AdminConsole";
import { GetAdminReviewData } from "@/application/use-cases/GetAdminReviewData";
import { container } from "@/infrastructure/di/container";

export const metadata: Metadata = { title: "Administrasi | Kurata", description: "Pusat peninjauan pengguna, broker, aset, dan konten Kurata." };

export default async function AdminPage() {
  const data = await new GetAdminReviewData(container.adminRepo).execute();
  return <AdminConsole initialData={data} />;
}
