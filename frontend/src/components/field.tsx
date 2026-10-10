import type { InputHTMLAttributes } from "react";

export function Field({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-ocean-800">
      {label}
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-ocean-200 bg-white px-3 py-2 text-ocean-900 outline-none focus:border-brand focus:ring-2 focus:ring-accent/40"
      />
    </label>
  );
}