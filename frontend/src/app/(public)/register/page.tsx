"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import { Field } from "@/components/field";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

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
          <h1 className="text-2xl font-bold text-ocean-900">Register</h1>
          {state?.error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <Field label="Name" name="name" type="text" autoComplete="name" required />
          <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
          <Field label="Password" name="password" type="password" autoComplete="new-password" required />
          <fieldset className="grid grid-cols-2 gap-3">
            {(["BUYER", "SUPPLIER"] as const).map((r) => (
              <label
                key={r}
                className="cursor-pointer rounded-lg border border-ocean-200 p-3 text-center text-sm has-[:checked]:border-brand has-[:checked]:bg-ocean-50"
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  defaultChecked={(state?.values?.role ?? "BUYER") === r}
                  className="sr-only"
                />
                <span className="font-semibold text-ocean-900">{r === "BUYER" ? "Buyer" : "Supplier"}</span>
                <span className="block text-xs text-ocean-500">
                  {r === "BUYER" ? "Pet shop / retailer" : "Breeder / exporter"}
                </span>
              </label>
            ))}
          </fieldset>
          <button
            disabled={pending}
            className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-ocean-800 disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
          <p className="text-sm text-ocean-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand underline">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}