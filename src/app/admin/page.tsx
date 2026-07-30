import type { Metadata } from "next";
import { AdminConsole } from "@/presentation/components/admin/AdminConsole";

export const metadata: Metadata = { title: "Administrasi | Kurata", description: "Pusat peninjauan pengguna, broker, aset, dan konten Kurata." };

export default function AdminPage() { return <AdminConsole />; }
