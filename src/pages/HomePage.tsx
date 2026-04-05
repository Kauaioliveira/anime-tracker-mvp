import { useEffect, useMemo, useState } from 'react'
import Header from '../Header.tsx'
import SearchBar from '../components/SearchBar.tsx'
import AnimeList from '../components/AnimeList.tsx'
import type {
  Anime,
  JikanPagination,
  JikanTopAnimeResponse,
} from '../types/anime.ts'

const LIMIT = '12'

function buildListUrl(submittedQuery: string, page: number): string {
  const pageStr = String(page)
  if (submittedQuery === '') {
    const params = new URLSearchParams({ limit: LIMIT, page: pageStr })
    return `https://api.jikan.moe/v4/top/anime?${params.toString()}`
  }
  const params = new URLSearchParams({
    limit: LIMIT,
    q: submittedQuery,
    page: pageStr,
  })
  return `https://api.jikan.moe/v4/anime?${params.toString()}`
}

export default function HomePage() {
  /** Texto que o utilizador está a escrever (ainça não submetido). */
  const [inputQuery, setInputQuery] = useState('')
  /** Última pesquisa submetida: '' = top anime; senão = termo q= na API. */
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [page, setPage] = useState(1)

  const feedUrl = useMemo(
    () => buildListUrl(submittedQuery, page),
    [submittedQuery, page],
  )

  const [animes, setAnimes] = useState<Anime[]>([])
  const [pagination, setPagination] = useState<JikanPagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
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
          setError(e instanceof Error ? e.message : 'Failed to load')
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

  /** Nova pesquisa: guarda termo e volta à página 1. */
  function handleSearch() {
    const q = inputQuery.trim()
    setSubmittedQuery(q === '' ? '' : q)
    setPage(1)
  }

  return (
    <div className="app">
      <Header
        title="Anime Tracker"
        description="Follow your favorite animes and make your anime-watching experience more fun."
      />

      <main className="app__main">
        <SearchBar
          value={inputQuery}
          onChange={setInputQuery}
          onSearch={handleSearch}
        />

        {loading && <p className="app__status">Loading…</p>}
        {error && (
          <p className="app__status app__status--error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && <AnimeList animes={animes} />}

        {!loading && !error && pagination !== null && (
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
