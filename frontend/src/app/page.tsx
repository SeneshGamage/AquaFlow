import Link from "next/link";
import { redirect } from "next/navigation";
import { ROLE_HOME } from "@/lib/jwt";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  if (session) redirect(ROLE_HOME[session.role]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ocean-900 p-6 text-center text-white">
      <h1 className="text-5xl font-extrabold">
        Aqua<span className="text-accent">Flow</span>
      </h1>
      <p className="text-ocean-300">Homepage coming in Week 2.</p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded-lg bg-accent px-5 py-2 font-semibold text-ocean-900">
          Sign in
        </Link>
        <Link href="/register" className="rounded-lg border border-white/40 px-5 py-2 font-semibold">
          Register
        </Link>
      </div>
    </main>
  );
}