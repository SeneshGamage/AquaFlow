import { Fish as FishIcon } from "lucide-react";
import Image from "next/image";
import { StockBadge } from "@/components/badges";
import { OrderDialog } from "@/components/order-dialog";
import { formatPrice } from "@/lib/format";
import type { Fish } from "@/lib/types";

export function FishCard({ fish }: { fish: Fish }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-ocean-100">
        {fish.imageUrl ? (
          <Image
            src={fish.imageUrl}
            alt={fish.commonName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FishIcon className="h-10 w-10 text-ocean-400" />
          </div>
        )}
        <div className="absolute right-3 top-3">
          <StockBadge quantity={fish.quantityInStock} />
        </div>
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-ocean-900">{fish.commonName}</h2>
        {fish.scientificName && <p className="text-xs italic text-ocean-500">{fish.scientificName}</p>}

        <div className="mt-3 flex items-end justify-between text-sm">
          <div>
            <div className="text-ocean-500">Origin</div>
            <div className="font-medium text-ocean-800">{fish.originCountry}</div>
          </div>
          <div className="text-right">
            <div className="text-ocean-500">Price / unit</div>
            <div className="text-lg font-bold text-brand">{formatPrice(fish.pricePerUnit)}</div>
          </div>
        </div>

        <OrderDialog fish={fish} />
      </div>
    </article>
  );
}