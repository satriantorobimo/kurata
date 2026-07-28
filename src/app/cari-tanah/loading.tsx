export default function SearchPropertiesLoading() {
  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20" aria-label="Memuat pencarian tanah" role="status">
      <div className="border-b border-border-subtle bg-surface-container-low py-10 md:py-14">
        <div className="container-main animate-pulse">
          <div className="mb-3 h-4 w-32 rounded bg-surface-container-high" />
          <div className="mb-3 h-10 w-64 rounded bg-surface-container-high" />
          <div className="mb-7 h-5 max-w-xl rounded bg-surface-container-high" />
          <div className="h-16 rounded-xl bg-surface-container-high" />
        </div>
      </div>
      <div className="container-main grid gap-8 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="h-96 animate-pulse rounded-xl bg-surface-container-high" />
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-96 animate-pulse rounded-xl bg-surface-container-high" />)}
        </div>
      </div>
    </div>
  );
}
