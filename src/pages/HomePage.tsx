import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/search/SearchBar.tsx'
import AnimeScrollRow from '../components/anime/AnimeScrollRow.tsx'
import AnimeScrollRowSkeleton from '../components/anime/AnimeScrollRowSkeleton.tsx'
import AnimeList from '../components/anime/AnimeList.tsx'
import AnimeListSkeleton from '../components/anime/AnimeListSkeleton.tsx'
import PaginationNav from '../components/ui/PaginationNav.tsx'
import { useSpotlight } from '../hooks/useSpotlight.ts'
import { useAnimeFeed } from '../hooks/useAnimeFeed.ts'
import { useAnimeSearch } from '../hooks/useAnimeSearch.ts'
import type { SearchMode } from '../types/searchMode.ts'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q')
  const urlMode = searchParams.get('mode')

  const spotlight = useSpotlight()

  const feed = useAnimeFeed()

  const search = useAnimeSearch({
    resetPage: feed.resetPage,
    setListState: feed.setListState,
    setFeedError: feed.setError,
  })

  const skipUrlSync = useRef(false)
  const prevQRef = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      prevQRef.current = q
      return
    }

    if (q !== null) {
      const mode = (urlMode ?? 'title') as SearchMode
      void search.applySearchFromUrl(mode, q)
    } else if (prevQRef.current !== undefined && prevQRef.current !== null) {
      void search.applySearchFromUrl('title', '')
    }

    prevQRef.current = q
  }, [q, urlMode, search.applySearchFromUrl])

  const handleSearchWithUrl = useCallback(() => {
    skipUrlSync.current = true
    const raw = search.query.trim()
    if (raw === '') {
      setSearchParams({}, { replace: true })
    } else if (search.mode === 'title') {
      setSearchParams({ q: raw }, { replace: true })
    } else {
      setSearchParams({ mode: search.mode, q: raw }, { replace: true })
    }
    void search.handleSearch()
  }, [search.query, search.mode, search.handleSearch, setSearchParams])

  const handleModeChangeWithUrl = useCallback(
    (mode: SearchMode) => {
      if (searchParams.has('q')) {
        skipUrlSync.current = true
        setSearchParams({}, { replace: true })
      }
      search.handleModeChange(mode)
    },
    [search.handleModeChange, searchParams, setSearchParams],
  )

  const showList = !feed.loading && !feed.error

  return (
    <main className="mx-auto max-w-[1200px] pb-[max(2rem,env(safe-area-inset-bottom,0px))] ps-[max(1.25rem,env(safe-area-inset-left,0px))] pe-[max(1.25rem,env(safe-area-inset-right,0px))]">
      {/* ── Hero: title + carousel fill the viewport below the sticky header ── */}
      <div className="flex min-h-[calc(100dvh-3.75rem)] flex-col justify-center gap-6 py-6">
        <section
          className="text-center"
          aria-labelledby="home-heading"
        >
          <h1
            id="home-heading"
            className="font-bangers mb-3 mt-0 text-balance text-[clamp(2.5rem,8vw,4.5rem)] font-normal leading-[1.05] tracking-wide text-[var(--text-h)] [text-shadow:0_2px_24px_rgba(167,139,250,0.45),0_1px_0_rgba(0,0,0,0.35)]"
          >
            AnimeZone
          </h1>
          <p
            className="font-michroma mx-auto mb-0 max-w-xl text-[0.72rem] font-normal uppercase leading-relaxed tracking-[0.18em] text-[var(--text)] sm:text-[0.78rem] sm:tracking-[0.22em]"
          >
            Track your favorite anime and keep lists of what you have watched and
            what you plan to watch next.
          </p>
        </section>

        <section>
          {spotlight.loading ? (
            <AnimeScrollRowSkeleton
              title={spotlight.copy.title}
              hint={spotlight.copy.hint}
              spotlightMode={spotlight.copy.mode}
            />
          ) : (
            <AnimeScrollRow
              title={spotlight.copy.title}
              hint={spotlight.copy.hint}
              spotlightMode={spotlight.copy.mode}
              animes={spotlight.animes}
            />
          )}
        </section>
      </div>

      {/* ── Below the fold: search + results ── */}
      <div className="px-5 pt-8">
      <SearchBar
        mode={search.mode}
        onModeChange={handleModeChangeWithUrl}
        value={search.query}
        onChange={search.setQuery}
        onSearch={handleSearchWithUrl}
      />

      {search.busy && !feed.loading && (
        <p className="mb-4 mt-0 text-[var(--text)]">Looking up studio…</p>
      )}
      {feed.error && (
        <p className="mb-4 mt-0 text-red-700 dark:text-red-300" role="alert">
          {feed.error}
        </p>
      )}
      {search.error && (
        <p className="mb-4 mt-0 text-red-700 dark:text-red-300" role="alert">
          {search.error}
        </p>
      )}

      {feed.loading && !feed.error && (
        <AnimeListSkeleton count={feed.skeletonCount} />
      )}
      {showList && <AnimeList animes={feed.animes} />}

      {showList && feed.pagination !== null && (
        <PaginationNav pagination={feed.pagination} onGoToPage={feed.goToPage} />
      )}
      </div>
    </main>
  )
}
