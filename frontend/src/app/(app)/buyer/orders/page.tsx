import Link from "next/link";
import { OrderStatusBadge } from "@/components/badges";
import { PageBanner } from "@/components/page-banner";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getMyOrders } from "@/lib/orders";
import { requireRole } from "@/lib/session";

export default async function MyOrdersPage() {
  await requireRole("BUYER");
  const orders = (await getMyOrders()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <PageBanner eyebrow="My Orders" title="Your purchases, tracked end to end" image="banner_a.jpg" />
      <main className="mx-auto max-w-6xl p-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-ocean-600">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/buyer/catalog"
              className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-800"
            >
              Browse the catalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ocean-100 bg-ocean-50 text-ocean-700">
                <tr>
                  <th className="p-3 font-semibold">Order</th>
                  <th className="p-3 font-semibold">Fish</th>
                  <th className="p-3 font-semibold">Qty</th>
                  <th className="p-3 font-semibold">Total</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-ocean-50 last:border-0">
                    <td className="p-3 font-medium text-ocean-900">#{o.id}</td>
                    <td className="p-3">{o.fishName}</td>
                    <td className="p-3">{o.quantity}</td>
                    <td className="p-3">{formatPrice(o.totalPrice)}</td>
                    <td className="p-3">
                      <OrderStatusBadge status={o.status} />
                      {o.rejectionReason && (
                        <div className="mt-1 text-xs text-red-700">Reason: {o.rejectionReason}</div>
                      )}
                    </td>
                    <td className="p-3 text-ocean-600">{formatDateTime(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}