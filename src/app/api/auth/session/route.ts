import { getCurrentAuthContext } from "@/infrastructure/security/authorization-dal";

export async function GET() {
  const session = await getCurrentAuthContext();

  if (!session) {
    return Response.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
  }

  return Response.json(
    { user: { role: session.role } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
