import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, MapPin } from "lucide-react";
import { WorkspaceLayout } from "@/presentation/components/workspace/WorkspaceLayout";
import { GetUserWorkspace } from "@/application/use-cases/GetUserWorkspace";
import { container } from "@/infrastructure/di/container";
import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export default async function FavoritesPage() {
  const auth = await getCurrentAuthContext();
  if (!auth) redirect("/masuk");

  const workspace = await new GetUserWorkspace(container.workspaceRepo).execute(auth.userId, auth.email);

  return <WorkspaceLayout kind="user" title="Properti tersimpan" description="Koleksi properti yang ingin Anda pertimbangkan kembali."><div className="grid gap-5 md:grid-cols-2">{workspace.favoriteProperties.map((property) => <Link href={`/cari-tanah/${property.id}`} key={property.id} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-container-lowest shadow-card"><div className="h-48 bg-surface-container-high bg-cover bg-center" style={{ backgroundImage: `url(${property.imageUrl})` }} /><div className="p-5"><div className="flex justify-between gap-3"><h2 className="text-headline-sm font-headline-sm text-on-surface">{property.title}</h2><Heart className="h-5 w-5 shrink-0 fill-primary text-primary" /></div><p className="mt-3 flex items-center gap-2 text-body-md text-on-surface-variant"><MapPin className="h-4 w-4 text-primary" />{property.location}</p><p className="mt-4 text-xl font-bold text-primary">{property.price}</p></div></Link>)}</div></WorkspaceLayout>;
}
