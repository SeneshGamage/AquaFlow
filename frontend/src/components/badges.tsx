const LOW_STOCK_AT = 10;

export function StockBadge({ quantity }: { quantity: number }) {
  const [label, style] =
    quantity <= 0
      ? ["Out of stock", "bg-red-100 text-red-800"]
      : quantity <= LOW_STOCK_AT
        ? ["Low stock", "bg-amber-100 text-amber-800"]
        : ["In stock", "bg-green-100 text-green-800"];

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow ${style}`}>{label}</span>
  );
}