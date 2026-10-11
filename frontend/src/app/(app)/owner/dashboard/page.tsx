import { PageBanner } from "@/components/page-banner";
import { requireRole } from "@/lib/session";

export default async function Page() {
  const session = await requireRole("OWNER");
  return (
    <>
      <PageBanner eyebrow="Owner · Dashboard" title="Your whole trade, at a glance" image="banner_a.jpg" />
      <main className="mx-auto max-w-6xl p-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-ocean-600">Welcome, {session.name}. Coming soon.</p>
        </div>
      </main>
    </>
  );
}