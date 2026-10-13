const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** Pure helper (safe to import from client components). */
export const formatPrice = (amount: number) => usd.format(amount);