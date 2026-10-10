import Link from "next/link";

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ocean-50 p-6 text-center">
      <h1 className="text-3xl font-bold text-ocean-900">Access denied</h1>
      <p className="text-ocean-600">Your account doesn't have permission to view this page.</p>
      <Link href="/" className="rounded-lg bg-brand px-4 py-2 font-semibold text-white">Go to my home</Link>
    </main>
  );
}