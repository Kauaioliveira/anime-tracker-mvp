export default function AnimeDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading anime details">
      <div className="mb-4 flex flex-wrap items-start gap-4">
        <div className="min-h-10 min-w-[200px] flex-1 rounded-lg bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
        <div className="flex flex-wrap gap-2">
          <div className="h-11 w-[8.5rem] rounded-lg bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
          <div className="h-11 w-[8.5rem] rounded-lg bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
          <div className="h-11 w-[8.5rem] rounded-lg bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <div className="aspect-[225/318] w-full min-w-[200px] max-w-[300px] rounded-[10px] bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
        <div className="flex min-w-[280px] flex-1 flex-col gap-2.5">
          <div className="h-4 rounded-md bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
          <div className="h-4 rounded-md bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
          <div className="h-4 w-[55%] rounded-md bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
          <div className="h-4 rounded-md bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
          <div className="h-[5.5rem] rounded-lg bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
        </div>
      </div>
    </div>
  )
}
