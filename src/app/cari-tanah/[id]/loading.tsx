export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20" role="status" aria-label="Memuat detail properti">
      <div className="container-main animate-pulse py-5"><div className="h-4 w-64 rounded bg-surface-container-high" /></div>
      <main className="container-main pb-16">
        <div className="grid gap-3 md:grid-cols-2"><div className="min-h-72 rounded-xl bg-surface-container-high md:row-span-2 md:min-h-[31rem]" /><div className="min-h-44 rounded-xl bg-surface-container-high" /><div className="min-h-44 rounded-xl bg-surface-container-high" /></div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-6"><div className="h-40 rounded-xl bg-surface-container-high" /><div className="h-72 rounded-xl bg-surface-container-high" /></div><div className="h-80 rounded-xl bg-surface-container-high" /></div>
      </main>
    </div>
  );
}
