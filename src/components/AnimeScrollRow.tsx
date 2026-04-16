import { Link } from 'react-router-dom'
import { CalendarDays, Trophy } from 'lucide-react'
import type { SpotlightMode } from '../config/homeSpotlight.ts'
import type { Anime } from '../types/anime.ts'

type AnimeScrollRowProps = {
  title: string
  hint: string
  animes: Anime[]
  spotlightMode: SpotlightMode
}

export default function AnimeScrollRow({
  title,
  hint,
  animes,
  spotlightMode,
}: AnimeScrollRowProps) {
  if (animes.length === 0) {
    return null
  }

  const sectionId = 'spotlight-anime-heading'
  const hintId = 'spotlight-anime-hint'
  const countId = 'spotlight-anime-count'
  const TitleIcon = spotlightMode === 'top_scores' ? Trophy : CalendarDays

  return (
    <section
      className="mb-7 rounded-2xl border border-[var(--border)] bg-[linear-gradient(165deg,var(--accent-bg)_0%,color-mix(in_srgb,var(--bg)_92%,var(--accent-bg))_48%,var(--bg)_100%)] px-[clamp(0.65rem,3vw,1rem)] py-[clamp(0.85rem,2.5vw,1.1rem)] pb-[clamp(0.95rem,2.5vw,1.15rem)] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.22)]"
      aria-labelledby={sectionId}
      aria-describedby={`${hintId} ${countId}`}
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
        <p id={countId} className="sr-only">
          Horizontal row with {animes.length}{' '}
          {animes.length === 1 ? 'title' : 'titles'}.
        </p>
      </div>
      <div className="relative -mx-0.5 pb-2">
        <ul
          className="flex list-none gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-0.5 py-2 [-webkit-overflow-scrolling:touch] [scrollbar-color:var(--accent-border)_transparent] [scrollbar-width:thin] snap-x snap-mandatory scroll-pl-2 scroll-pr-2 max-sm:gap-3 max-sm:scroll-pl-[max(0.2rem,env(safe-area-inset-left,0px))] max-sm:scroll-pr-[max(0.2rem,env(safe-area-inset-right,0px))] [&::-webkit-scrollbar]:h-[7px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(90deg,var(--accent-border),color-mix(in_srgb,var(--accent-border)_70%,var(--text-h)))] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[color-mix(in_srgb,var(--border)_35%,transparent)]"
        >
          {animes.map((anime) => (
            <li key={anime.mal_id} className="w-[8.85rem] shrink-0 snap-start">
              <Link
                to={`/anime/${anime.mal_id}`}
                className="group flex -m-0.5 flex-col gap-1.5 rounded-[14px] p-0.5 text-inherit no-underline outline-offset-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-border)] motion-reduce:transition-none"
              >
                <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--border)_80%,var(--accent-border))] shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-[transform,box-shadow] duration-200 ease-out motion-reduce:transition-none dark:shadow-[0_6px_20px_rgba(0,0,0,0.35)] group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-[0_14px_28px_rgba(0,0,0,0.12),0_0_0_1px_color-mix(in_srgb,var(--accent-border)_45%,transparent)] group-focus-visible:-translate-y-0.5 dark:group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.4),0_0_0_1px_color-mix(in_srgb,var(--accent-border)_55%,transparent)] motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:shadow-none motion-reduce:group-focus-visible:translate-y-0">
                  <img
                    className="block aspect-[225/318] w-full object-cover"
                    src={anime.images.jpg.image_url}
                    alt=""
                    loading="lazy"
                    width={160}
                    height={227}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/65 via-black/10 to-transparent"
                    aria-hidden
                  />
                  {anime.score != null && typeof anime.score === 'number' && (
                    <span className="absolute bottom-1.5 right-1.5 z-[1] inline-flex items-center gap-0.5 rounded-lg border border-white/20 bg-gradient-to-br from-amber-400/95 to-amber-600/90 px-[0.45rem] py-0.5 text-[0.68rem] font-bold tracking-wide text-white shadow-md">
                      <span className="text-[0.62rem] leading-none opacity-95" aria-hidden>
                        {'\u2605'}
                      </span>
                      {anime.score.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="line-clamp-2 min-h-[2.05em] px-0.5 text-[0.84rem] font-semibold leading-snug text-[var(--text-h)] transition-colors duration-150 group-hover:text-[color-mix(in_srgb,var(--text-h)_88%,var(--accent-border))]">
                  {anime.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
