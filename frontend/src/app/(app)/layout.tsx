import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-ocean-50">
      <Navbar session={session} />
      {children}
    </div>
  );
}