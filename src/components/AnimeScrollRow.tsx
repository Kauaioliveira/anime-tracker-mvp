import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import type { SpotlightMode } from '../config/homeSpotlight.ts'
import type { Anime } from '../types/anime.ts'

type AnimeScrollRowProps = {
  title: string
  hint: string
  animes: Anime[]
  spotlightMode: SpotlightMode
}

const AUTO_INTERVAL_MS = 2000

function getScrollStepPx(container: HTMLUListElement): number {
  const first = container.querySelector('li')
  if (!first) return Math.max(120, container.clientWidth * 0.35)
  const gapRaw = getComputedStyle(container).gap || getComputedStyle(container).columnGap
  const gap = Number.parseFloat(gapRaw) || 16
  return first.getBoundingClientRect().width + gap
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function AnimeScrollRow({
  title,
  hint,
  animes,
  spotlightMode,
}: AnimeScrollRowProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [canScroll, setCanScroll] = useState(false)
  const [hoverPause, setHoverPause] = useState(false)
  const [focusPause, setFocusPause] = useState(false)
  const pauseAuto = hoverPause || focusPause

  const updateCanScroll = useCallback(() => {
    const el = listRef.current
    if (!el) return
    setCanScroll(el.scrollWidth > el.clientWidth + 2)
  }, [])

  useLayoutEffect(() => {
    updateCanScroll()
  }, [animes, updateCanScroll])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const ro = new ResizeObserver(() => updateCanScroll())
    ro.observe(el)
    return () => ro.disconnect()
  }, [animes.length, updateCanScroll])

  const scrollByDirection = useCallback((direction: 1 | -1) => {
    const el = listRef.current
    if (!el) return
    const step = getScrollStepPx(el)
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) return
    const instant = prefersReducedMotion()

    if (direction < 0) {
      if (el.scrollLeft <= 2) {
        el.scrollTo({ left: max, behavior: instant ? 'auto' : 'smooth' })
      } else {
        el.scrollBy({ left: -step, behavior: instant ? 'auto' : 'smooth' })
      }
    } else {
      if (el.scrollLeft + step >= max - 2) {
        el.scrollTo({ left: 0, behavior: instant ? 'auto' : 'smooth' })
      } else {
        el.scrollBy({ left: step, behavior: instant ? 'auto' : 'smooth' })
      }
    }
  }, [])

  useEffect(() => {
    if (!canScroll || animes.length < 2 || pauseAuto) return
    if (prefersReducedMotion()) return

    const id = window.setInterval(() => {
      scrollByDirection(1)
    }, AUTO_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [animes.length, canScroll, pauseAuto, scrollByDirection])

  if (animes.length === 0) {
    return null
  }

  const sectionId = 'spotlight-anime-heading'
  const hintId = 'spotlight-anime-hint'
  const countId = 'spotlight-anime-count'
  const TitleIcon = spotlightMode === 'top_scores' ? Trophy : CalendarDays

  const trackClasses =
    'flex list-none gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-0.5 py-2 scroll-smooth snap-x snap-mandatory scroll-pl-2 scroll-pr-2 max-sm:gap-3 max-sm:scroll-pl-[max(0.2rem,env(safe-area-inset-left,0px))] max-sm:scroll-pr-[max(0.2rem,env(safe-area-inset-right,0px))] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'

  return (
    <section
      className="mb-7 rounded-2xl border border-[var(--border)] bg-[linear-gradient(165deg,var(--accent-bg)_0%,color-mix(in_srgb,var(--bg)_92%,var(--accent-bg))_48%,var(--bg)_100%)] px-[clamp(0.65rem,3vw,1rem)] py-[clamp(0.85rem,2.5vw,1.1rem)] pb-[clamp(0.95rem,2.5vw,1.15rem)] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.22)]"
      aria-labelledby={sectionId}
      aria-describedby={`${hintId} ${countId}`}
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
      onFocusCapture={() => setFocusPause(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusPause(false)
        }
      }}
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
        <p
          id={hintId}
          className="m-0 max-w-[42rem] text-[0.9rem] leading-normal tracking-wide text-[var(--text)]"
        >
          {hint}
        </p>
        <p id={countId} className="sr-only">
          Carousel with {animes.length}{' '}
          {animes.length === 1 ? 'title' : 'titles'}. Use the previous and next
          buttons to move through titles. The row also advances automatically
          every {AUTO_INTERVAL_MS / 1000} seconds unless you hover or focus
          inside this section.
        </p>
      </div>
      <div className="relative -mx-0.5 pb-2">
        {canScroll ? (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-[2] flex w-12 items-center justify-start bg-[linear-gradient(90deg,var(--bg)_0%,transparent_100%)] ps-0.5 max-sm:w-10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-[2] flex w-12 items-center justify-end bg-[linear-gradient(270deg,var(--bg)_0%,transparent_100%)] pe-0.5 max-sm:w-10"
              aria-hidden
            />
            <button
              type="button"
              className="pointer-events-auto absolute left-1 top-1/2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--border)_80%,var(--accent-border))] bg-[color-mix(in_srgb,var(--bg)_88%,var(--accent-bg))] text-[var(--text-h)] shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur-[6px] transition-[border-color,background-color,transform] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-border)] active:scale-95 motion-reduce:transition-none max-sm:left-0.5 max-sm:h-10 max-sm:w-10"
              aria-label="Show previous titles"
              onClick={() => scrollByDirection(-1)}
            >
              <ChevronLeft size={22} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              className="pointer-events-auto absolute right-1 top-1/2 z-[3] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--border)_80%,var(--accent-border))] bg-[color-mix(in_srgb,var(--bg)_88%,var(--accent-bg))] text-[var(--text-h)] shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur-[6px] transition-[border-color,background-color,transform] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-border)] active:scale-95 motion-reduce:transition-none max-sm:right-0.5 max-sm:h-10 max-sm:w-10"
              aria-label="Show next titles"
              onClick={() => scrollByDirection(1)}
            >
              <ChevronRight size={22} strokeWidth={2} aria-hidden />
            </button>
          </>
        ) : null}
        <ul ref={listRef} className={trackClasses}>
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
                      <span
                        className="text-[0.62rem] leading-none opacity-95"
                        aria-hidden
                      >
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
