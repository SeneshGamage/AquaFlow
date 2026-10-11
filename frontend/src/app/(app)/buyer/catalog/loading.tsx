export default function Loading() {
    return (
      <main className="mx-auto max-w-6xl p-4">
        <div className="grid gap-6 pt-40 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-ocean-100" />
          ))}
        </div>
      </main>
    );
  }