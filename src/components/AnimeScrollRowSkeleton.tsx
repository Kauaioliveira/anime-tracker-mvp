import { CalendarDays, Trophy } from 'lucide-react'
import type { SpotlightMode } from '../config/homeSpotlight.ts'

const PLACEHOLDER_COUNT = 8

type AnimeScrollRowSkeletonProps = {
  title: string
  hint: string
  spotlightMode: SpotlightMode
}

export default function AnimeScrollRowSkeleton({
  title,
  hint,
  spotlightMode,
}: AnimeScrollRowSkeletonProps) {
  const sectionId = 'spotlight-anime-heading-sk'
  const hintId = 'spotlight-anime-hint-sk'
  const TitleIcon = spotlightMode === 'top_scores' ? Trophy : CalendarDays

  return (
    <section
      className="mb-7 rounded-2xl border border-[var(--border)] bg-[linear-gradient(165deg,var(--accent-bg)_0%,color-mix(in_srgb,var(--bg)_92%,var(--accent-bg))_48%,var(--bg)_100%)] px-[clamp(0.65rem,3vw,1rem)] py-[clamp(0.85rem,2.5vw,1.1rem)] pb-[clamp(0.95rem,2.5vw,1.15rem)] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.22)]"
      aria-labelledby={sectionId}
      aria-describedby={hintId}
      aria-busy="true"
    >
      <div className="mb-[0.85rem] px-0.5">
        <div className="mb-1.5 flex items-center gap-2">
          <TitleIcon
            size={20}
            className="shrink-0 text-[var(--accent-border)] opacity-95"
            strokeWidth={1.75}
            aria-hidden
          />
          <h2
            id={sectionId}
            className="font-heading m-0 text-[1.45rem] font-bold tracking-wide text-[var(--text-h)]"
          >
            {title}
          </h2>
        </div>
        <p id={hintId} className="m-0 max-w-[42rem] text-[0.9rem] leading-normal tracking-wide text-[var(--text)]">
          {hint}
        </p>
        <p className="sr-only">Loading highlights.</p>
      </div>
      <div className="relative -mx-0.5 pb-2">
        <ul className="flex list-none gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-0.5 py-2 [-webkit-overflow-scrolling:touch] [scrollbar-color:var(--accent-border)_transparent] [scrollbar-width:thin] snap-x snap-mandatory scroll-pl-2 scroll-pr-2 max-sm:gap-3 max-sm:scroll-pl-[max(0.2rem,env(safe-area-inset-left,0px))] max-sm:scroll-pr-[max(0.2rem,env(safe-area-inset-right,0px))] [&::-webkit-scrollbar]:h-[7px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(90deg,var(--accent-border),color-mix(in_srgb,var(--accent-border)_70%,var(--text-h)))] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[color-mix(in_srgb,var(--border)_35%,transparent)]">
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <li key={`scroll-sk-${i}`} className="w-[8.85rem] shrink-0 snap-start">
              <div className="pointer-events-none flex -m-0.5 cursor-default flex-col gap-1.5 rounded-[14px] p-0.5">
                <div className="relative overflow-hidden rounded-xl border border-[var(--border)] shadow-none">
                  <div className="block aspect-[225/318] w-full rounded-xl bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
                </div>
                <div className="mt-1.5 block h-[2.05em] rounded-md bg-[color-mix(in_srgb,var(--border)_65%,var(--bg))] animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
