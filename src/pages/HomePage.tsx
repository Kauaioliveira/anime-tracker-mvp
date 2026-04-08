import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '../Header.tsx'
import SearchBar from '../components/SearchBar.tsx'
import AnimeList from '../components/AnimeList.tsx'
import type {
  Anime,
  JikanPagination,
  JikanProducerSearchResponse,
  JikanTopAnimeResponse,
} from '../types/anime.ts'
import type { SearchMode } from '../types/searchMode.ts'

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

export default function HomePage() {
  const [searchMode, setSearchMode] = useState<SearchMode>('title')
  const [inputQuery, setInputQuery] = useState('')
  const [listState, setListState] = useState<ListFeedState>({ kind: 'top' })
  const [page, setPage] = useState(1)

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

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const res = await fetch(feedUrl)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const json = (await res.json()) as JikanTopAnimeResponse
        if (!cancelled) {
          setAnimes(json.data)
          setPagination(json.pagination)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load')
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

  const handleModeChange = useCallback((mode: SearchMode) => {
    setSearchMode(mode)
    setInputQuery('')
    setListState({ kind: 'top' })
    setPage(1)
    setSearchError(null)
    setLoadError(null)
  }, [])

  const handleSearch = useCallback(async () => {
    const raw = inputQuery.trim()
    setPage(1)
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
      const res = await fetch(`${JIKAN}/producers?${params.toString()}`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
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
  }, [inputQuery, searchMode])

  const busy = loading || searchBusy
  const showList = !loading && !loadError

  return (
    <div className="app">
      <Header
        title="Anime Tracker"
        description="Follow your favorite animes and make your anime-watching experience more fun."
      />

      <main className="app__main">
        <SearchBar
          mode={searchMode}
          onModeChange={handleModeChange}
          value={inputQuery}
          onChange={setInputQuery}
          onSearch={() => {
            void handleSearch()
          }}
        />

        {busy && <p className="app__status">Loading…</p>}
        {loadError && (
          <p className="app__status app__status--error" role="alert">
            {loadError}
          </p>
        )}
        {searchError && (
          <p className="app__status app__status--error" role="alert">
            {searchError}
          </p>
        )}

        {showList && <AnimeList animes={animes} />}

        {showList && pagination !== null && (
          <nav className="pagination" aria-label="Page navigation">
            <button
              type="button"
              className="pagination__btn"
              disabled={pagination.current_page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="pagination__info">
              Page {pagination.current_page} of{' '}
              {pagination.last_visible_page}
            </span>
            <button
              type="button"
              className="pagination__btn"
              disabled={!pagination.has_next_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </nav>
        )}
      </main>
    </div>
  )
}
