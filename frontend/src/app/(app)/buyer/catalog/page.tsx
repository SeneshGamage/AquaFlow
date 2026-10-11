import { Search } from "lucide-react";
import Form from "next/form";
import { FishCard } from "@/components/fish-card";
import { PageBanner } from "@/components/page-banner";
import { getFish } from "@/lib/fish";
import { requireRole } from "@/lib/session";

export default async function CatalogPage({
  searchParams,
}: {

  searchParams: Promise<{ q?: string | string[] }>;
}) {
  await requireRole("BUYER");

  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ) ?? "";
  const query = q.trim().toLowerCase();
  const all = await getFish();
  const fish = query
    ? all.filter((f) =>
        [f.commonName, f.scientificName, f.originCountry].some((v) => v?.toLowerCase().includes(query)),
      )
    : all;

  return (
    <>
      <PageBanner eyebrow="Fish Catalog" title="Find your next showstopper" />
      <main className="mx-auto max-w-6xl p-4">
        <Form action="/buyer/catalog" className="mb-6 flex gap-2" role="search">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or origin…"
            className="w-full max-w-sm rounded-lg border border-ocean-200 bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-accent/40"
          />
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-800">
            <Search className="h-4 w-4" /> Search
          </button>
        </Form>

        {fish.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-ocean-600 shadow-sm">
            {query ? `No fish match "${q}".` : "The catalog is empty for now."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fish.map((f) => (
              <FishCard key={f.id} fish={f} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}