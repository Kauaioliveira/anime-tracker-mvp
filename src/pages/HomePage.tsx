import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar.tsx'
import AnimeScrollRow from '../components/AnimeScrollRow.tsx'
import AnimeScrollRowSkeleton from '../components/AnimeScrollRowSkeleton.tsx'
import AnimeList from '../components/AnimeList.tsx'
import AnimeListSkeleton from '../components/AnimeListSkeleton.tsx'
import PaginationNav from '../components/PaginationNav.tsx'
import {
  getSpotlightCopy,
  getSpotlightFeedUrl,
} from '../config/homeSpotlight.ts'
import type {
  Anime,
  JikanPagination,
  JikanProducerSearchResponse,
  JikanTopAnimeResponse,
} from '../types/anime.ts'
import type { SearchMode } from '../types/searchMode.ts'
import { fetchJikan, jikanErrorMessage } from '../lib/jikanFetch.ts'

const LIMIT = '12'
const JIKAN = 'https://api.jikan.moe/v4'

type ListFeedState =
  | { kind: 'top' }
  | { kind: 'title'; q: string }
  | { kind: 'studio'; producerId: number }
  | { kind: 'year'; year: number }

function buildListUrl(state: ListFeedState, page: number): string {
  const pageStr = String(page)
  if (state.kind === 'top') {
    const params = new URLSearchParams({ limit: LIMIT, page: pageStr })
    return `${JIKAN}/top/anime?${params.toString()}`
  }
  if (state.kind === 'title') {
    const params = new URLSearchParams({
      limit: LIMIT,
      page: pageStr,
      q: state.q,
    })
    return `${JIKAN}/anime?${params.toString()}`
  }
  if (state.kind === 'studio') {
    const params = new URLSearchParams({
      limit: LIMIT,
      page: pageStr,
      producers: String(state.producerId),
    })
    return `${JIKAN}/anime?${params.toString()}`
  }
  const y = state.year
  const params = new URLSearchParams({
    limit: LIMIT,
    page: pageStr,
    start_date: `${y}-01-01`,
    end_date: `${y}-12-31`,
  })
  return `${JIKAN}/anime?${params.toString()}`
}

function pageFromSearchParams(searchParams: URLSearchParams): number {
  const raw = searchParams.get('page')
  if (raw === null || raw === '') {
    return 1
  }
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) {
    return 1
  }
  return n
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = pageFromSearchParams(searchParams)

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, next)
      setSearchParams(
        (prev) => {
          const q = new URLSearchParams(prev)
          if (clamped <= 1) {
            q.delete('page')
          } else {
            q.set('page', String(clamped))
          }
          return q
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const resetPageInUrl = useCallback(() => {
    setSearchParams(
      (prev) => {
        const q = new URLSearchParams(prev)
        q.delete('page')
        return q
      },
      { replace: true },
    )
  }, [setSearchParams])

  const [searchMode, setSearchMode] = useState<SearchMode>('title')
  const [inputQuery, setInputQuery] = useState('')
  const [listState, setListState] = useState<ListFeedState>({ kind: 'top' })

  const feedUrl = useMemo(
    () => buildListUrl(listState, page),
    [listState, page],
  )

  const [animes, setAnimes] = useState<Anime[]>([])
  const [pagination, setPagination] = useState<JikanPagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchBusy, setSearchBusy] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [spotlight, setSpotlight] = useState<Anime[]>([])
  const [spotlightLoading, setSpotlightLoading] = useState(true)

  const spotlightCopy = useMemo(() => getSpotlightCopy(), [])

  useEffect(() => {
    let cancelled = false
    /** Stagger spotlight after the main list request to avoid burst 429s from Jikan. */
    const timerId = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await fetchJikan(getSpotlightFeedUrl(JIKAN))
          if (res.ok) {
            const json = (await res.json()) as JikanTopAnimeResponse
            if (!cancelled) {
              setSpotlight(json.data)
            }
          } else if (!cancelled) {
            setSpotlight([])
          }
        } catch {
          if (!cancelled) {
            setSpotlight([])
          }
        } finally {
          if (!cancelled) {
            setSpotlightLoading(false)
          }
        }
      })()
    }, 1100)

    return () => {
      cancelled = true
      window.clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const res = await fetchJikan(feedUrl)
        if (!res.ok) {
          throw new Error(jikanErrorMessage(res.status))
        }
        const json = (await res.json()) as JikanTopAnimeResponse
        if (!cancelled) {
          setAnimes(json.data)
          setPagination(json.pagination)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : 'Failed to load',
          )
          setPagination(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [feedUrl])

  useEffect(() => {
    if (pagination === null) {
      return
    }
    const last = pagination.last_visible_page
    if (last < 1 || page <= last) {
      return
    }
    goToPage(last)
  }, [pagination, page, goToPage])

  const handleModeChange = useCallback((mode: SearchMode) => {
    setSearchMode(mode)
    setInputQuery('')
    setListState({ kind: 'top' })
    resetPageInUrl()
    setSearchError(null)
    setLoadError(null)
  }, [resetPageInUrl])

  const handleSearch = useCallback(async () => {
    const raw = inputQuery.trim()
    resetPageInUrl()
    setSearchError(null)

    if (searchMode === 'title') {
      setListState(raw === '' ? { kind: 'top' } : { kind: 'title', q: raw })
      return
    }

    if (searchMode === 'year') {
      if (raw === '') {
        setListState({ kind: 'top' })
        return
      }
      const y = Number.parseInt(raw, 10)
      const maxY = new Date().getFullYear() + 2
      if (!Number.isFinite(y) || y < 1917 || y > maxY) {
        setSearchError(`Enter a year between 1917 and ${maxY}.`)
        return
      }
      setListState({ kind: 'year', year: y })
      return
    }

    if (raw === '') {
      setListState({ kind: 'top' })
      return
    }

    setSearchBusy(true)
    try {
      const params = new URLSearchParams({ q: raw })
      const res = await fetchJikan(`${JIKAN}/producers?${params.toString()}`)
      if (!res.ok) {
        throw new Error(jikanErrorMessage(res.status))
      }
      const json = (await res.json()) as JikanProducerSearchResponse
      const first = json.data?.[0]
      if (first === undefined) {
        setSearchError('No studio found. Try a different name.')
        return
      }
      setListState({ kind: 'studio', producerId: first.mal_id })
    } catch (e) {
      setSearchError(
        e instanceof Error ? e.message : 'Failed to look up studio',
      )
    } finally {
      setSearchBusy(false)
    }
  }, [inputQuery, searchMode, resetPageInUrl])

  const showList = !loading && !loadError
  const listSkeletonCount = Number.parseInt(LIMIT, 10) || 12

  return (
    <main className="mx-auto max-w-[1200px] px-5 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-4 ps-[max(1.25rem,env(safe-area-inset-left,0px))] pe-[max(1.25rem,env(safe-area-inset-right,0px))]">
      <section className="mb-5" aria-label="AnimeZone">
        <img
          src="/animezonesf.png"
          alt="AnimeZone. Track your favorite anime and keep lists of what you have watched and what you plan to watch next."
          className="mx-auto block h-auto w-full max-w-6xl"
          decoding="async"
          fetchPriority="high"
        />
      </section>

      {spotlightLoading ? (
        <AnimeScrollRowSkeleton
          title={spotlightCopy.title}
          hint={spotlightCopy.hint}
          spotlightMode={spotlightCopy.mode}
        />
      ) : (
        <AnimeScrollRow
          title={spotlightCopy.title}
          hint={spotlightCopy.hint}
          spotlightMode={spotlightCopy.mode}
          animes={spotlight}
        />
      )}

      <SearchBar
        mode={searchMode}
        onModeChange={handleModeChange}
        value={inputQuery}
        onChange={setInputQuery}
        onSearch={() => {
          void handleSearch()
        }}
      />

      {searchBusy && !loading && (
        <p className="mb-4 mt-0 text-[var(--text)]">Looking up studio…</p>
      )}
      {loadError && (
        <p className="mb-4 mt-0 text-red-700 dark:text-red-300" role="alert">
          {loadError}
        </p>
      )}
      {searchError && (
        <p className="mb-4 mt-0 text-red-700 dark:text-red-300" role="alert">
          {searchError}
        </p>
      )}

      {loading && !loadError && (
        <AnimeListSkeleton count={listSkeletonCount} />
      )}
      {showList && <AnimeList animes={animes} />}

      {showList && pagination !== null && (
        <PaginationNav pagination={pagination} onGoToPage={goToPage} />
      )}
    </main>
  )
}
