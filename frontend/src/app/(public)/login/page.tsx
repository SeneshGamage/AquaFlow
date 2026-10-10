"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Field } from "@/components/field";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-ocean-900 p-10 text-white md:flex">
        <Link href="/" className="text-xl font-bold">
          Aqua<span className="text-accent">Flow</span>
        </Link>
        <div>
          <Image
            src="/img/betta1.jpg"
            alt="Red and white halfmoon betta"
            width={240}
            height={240}
            className="mb-8 rotate-3 rounded-3xl border-4 border-white object-cover shadow-2xl"
          />
          <p className="text-3xl font-semibold leading-tight">Beautiful fish. Seamless trade.</p>
          <p className="mt-2 text-ocean-300">Inventory, orders and shipments for the pet fish market.</p>
        </div>
        <p className="text-xs text-ocean-400">© 2026 AquaFlow</p>
      </aside>

      <section className="flex items-center justify-center bg-ocean-50 p-6">
        <form action={action} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-ocean-900">Sign in</h1>
          {state?.error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
          <Field label="Password" name="password" type="password" autoComplete="current-password" required />
          <button
            disabled={pending}
            className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-ocean-800 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-sm text-ocean-600">
            No account?{" "}
            <Link href="/register" className="font-medium text-brand underline">
              Register
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}