import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-ocean-50">
      <header className="bg-linear-to-r from-ocean-900 via-ocean-800 to-brand text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold">
            Aqua<span className="text-accent">Flow</span>
          </span>
          <div className="flex items-center gap-3 text-sm">
            <span>
              {session.name}{" "}
              <span className="rounded bg-white/15 px-2 py-0.5 text-xs">{session.role}</span>
            </span>
            <form action={logoutAction}>
              <button className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20">Logout</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}