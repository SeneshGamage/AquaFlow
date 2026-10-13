import { DeleteFishButton } from "@/components/delete-fish-button";
import { StockBadge } from "@/components/badges";
import { FishFormDialog } from "@/components/fish-form-dialog";
import { FishImage } from "@/components/fish-image";
import { PageBanner } from "@/components/page-banner";
import { getFish } from "@/lib/fish";
import { formatPrice } from "@/lib/format";
import { requireRole } from "@/lib/session";

export default async function InventoryPage() {
  await requireRole("OWNER");
  const fish = (await getFish()).sort((a, b) => a.commonName.localeCompare(b.commonName));

  return (
    <>
      <PageBanner eyebrow="Owner · Inventory" title="Every variety, every fish, in real time" image="banner_b.jpg" />
      <main className="mx-auto max-w-6xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ocean-900">Inventory ({fish.length})</h2>
          <FishFormDialog />
        </div>

        {fish.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-ocean-600 shadow-sm">
            No fish yet. Add your first one.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ocean-100 bg-ocean-50 text-ocean-700">
                <tr>
                  <th className="p-3 font-semibold">Fish</th>
                  <th className="p-3 font-semibold">Origin</th>
                  <th className="p-3 font-semibold">Stock</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fish.map((f) => (
                  <tr key={f.id} className="border-b border-ocean-50 last:border-0">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <FishImage src={f.imageUrl} alt={f.commonName} />
                        <div>
                          <div className="font-medium text-ocean-900">{f.commonName}</div>
                          {f.scientificName && <div className="text-xs italic text-ocean-500">{f.scientificName}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{f.originCountry}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-10 tabular-nums">{f.quantityInStock}</span>
                        <StockBadge quantity={f.quantityInStock} />
                      </div>
                    </td>
                    <td className="p-3">{formatPrice(f.pricePerUnit)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <FishFormDialog fish={f} />
                        <DeleteFishButton id={f.id} name={f.commonName} />
                      </div>
                    </td>
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