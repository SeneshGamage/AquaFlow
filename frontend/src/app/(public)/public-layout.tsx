import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLE_HOME } from "@/lib/jwt";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) redirect(ROLE_HOME[session.role]);
  return children;
}