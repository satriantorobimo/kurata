import { redirect } from "next/navigation";
import { Mail, Phone, UserRound } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { GetUserProfile } from "@/application/use-cases/GetUserProfile";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export default async function UserProfilePage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const profile = await new GetUserProfile(container.workspaceRepo).execute(auth.userId);

  return <WorkspaceLayout kind="user" title="Profil saya" description="Kelola informasi akun yang digunakan dalam proses layanan Kurata."><section className="rounded-2xl border border-border-subtle bg-surface-container-lowest p-6 shadow-card"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-on-primary">{profile.name.slice(0, 1)}</div><div><h2 className="text-xl font-bold text-on-surface">{profile.name}</h2><p className="mt-1 text-body-md text-on-surface-variant">Akun pengguna Kurata</p></div></div><div className="mt-7 grid gap-5 border-t border-border-subtle pt-6 sm:grid-cols-2"><Info icon={Mail} label="Email" value={profile.email} /><Info icon={Phone} label="Nomor WhatsApp" value={profile.phone ?? "-"} /></div><button className="mt-7 rounded-xl border border-primary px-4 py-2.5 text-label-md font-label-md text-primary hover:bg-primary/5">Edit profil</button></section></WorkspaceLayout>;
}
function Info({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) { return <div className="flex gap-3"><Icon className="mt-0.5 h-5 w-5 text-primary" /><div><p className="text-label-sm text-outline">{label}</p><p className="mt-1 text-label-md font-label-md text-on-surface">{value}</p></div></div>; }
