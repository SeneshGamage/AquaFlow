import { Fish, LogOut } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { NavLinks } from "@/components/nav-links";
import { NAV_LINKS } from "@/lib/nav";
import type { Session } from "@/lib/session";

export function Navbar({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-30 bg-linear-to-r from-ocean-900 via-ocean-800 to-brand text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="rounded-lg bg-white/15 p-1.5">
            <Fish className="h-5 w-5" />
          </span>
          <span>
            Aqua<span className="text-accent">Flow</span>
          </span>
        </Link>

        <NavLinks links={NAV_LINKS[session.role]} />

        <div className="flex items-center gap-3 text-sm">
          <div className="hidden text-right leading-tight sm:block">
            <div>{session.name}</div>
            <div className="text-xs uppercase tracking-wide text-ocean-300">{session.role}</div>
          </div>
          <form action={logoutAction}>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}