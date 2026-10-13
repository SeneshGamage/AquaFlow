import { AlertTriangle, Clock, Fish, ShoppingCart, Truck, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageBanner } from "@/components/page-banner";
import { getDashboardSummary } from "@/lib/dashboard";
import { requireRole } from "@/lib/session";

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-ocean-100 bg-white p-5 shadow-sm">
      <div>
        <div className="text-sm text-ocean-600">{label}</div>
        <div className="mt-1 text-3xl font-extrabold text-ocean-900">{value}</div>
      </div>
      <div className="rounded-xl bg-ocean-50 p-3 text-brand">{icon}</div>
    </div>
  );
}

export default async function OwnerDashboardPage() {
  await requireRole("OWNER");
  const s = await getDashboardSummary();

  return (
    <>
      <PageBanner eyebrow="Owner · Dashboard" title="Your whole trade, at a glance" image="banner_a.jpg" />
      <main className="mx-auto max-w-6xl space-y-6 p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<ShoppingCart className="h-6 w-6" />} label="Total orders" value={s.totalOrders} />
          <StatCard icon={<Clock className="h-6 w-6" />} label="Pending orders" value={s.pendingOrders} />
          <StatCard icon={<Truck className="h-6 w-6" />} label="Active shipments" value={s.activeShipments} />
          <StatCard icon={<Fish className="h-6 w-6" />} label="Fish listed" value={s.totalFishSpecies} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard icon={<Users className="h-6 w-6" />} label="Suppliers" value={s.totalSuppliers} />
          <StatCard icon={<Users className="h-6 w-6" />} label="Buyers" value={s.totalBuyers} />
        </div>

        <section className="rounded-2xl border border-ocean-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-ocean-900">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Low stock
            </h2>
            <Link href="/owner/inventory" className="text-sm font-medium text-brand underline">
              Go to inventory
            </Link>
          </div>
          {s.lowStockFish.length === 0 ? (
            <p className="mt-3 text-sm text-ocean-600">Nothing is running low. 🎉</p>
          ) : (
            <ul className="mt-3 divide-y divide-ocean-50 text-sm">
              {s.lowStockFish.map((f) => (
                <li key={f.id} className="flex items-center justify-between py-2">
                  <span className="text-ocean-800">{f.commonName}</span>
                  <span className={f.quantityInStock === 0 ? "font-semibold text-red-700" : "font-semibold text-amber-700"}>
                    {f.quantityInStock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}