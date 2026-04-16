export default function AnimeCardSkeleton() {
  return (
    <article
      className="relative flex min-h-0 flex-col overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg)] pointer-events-none"
      aria-hidden
    >
      <div className="block aspect-[225/318] w-full rounded-none bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
      <div className="mx-2.5 mb-1 mt-2 h-[calc(0.9rem*1.25*3)] rounded-md bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
      <div className="mx-2.5 mb-2 h-[calc(0.75rem*1.3*2)] rounded-md bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
    </article>
  )
}
