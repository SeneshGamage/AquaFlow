"use client";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-bold text-ocean-900">Something went wrong</h1>
      <p className="mt-2 text-ocean-600">We couldn&apos;t load this page. The server may be unavailable.</p>
      <button onClick={reset} className="mt-4 rounded-lg bg-brand px-4 py-2 font-semibold text-white">
        Try again
      </button>
    </main>
  );
}