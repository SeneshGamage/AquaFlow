const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Pure helper (safe to import from client components). */
export const formatPrice = (amount: number) => usd.format(amount);