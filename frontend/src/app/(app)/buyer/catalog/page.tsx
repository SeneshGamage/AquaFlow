import { requireRole } from "@/lib/session";

export default async function Page() {
  const session = await requireRole("BUYER");           // change per page
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-ocean-900">Buyer dashboard</h1>   {/* change per page */}
      <p className="mt-2 text-ocean-600">Welcome, {session.name}. Coming soon.</p>
    </div>
  );
}