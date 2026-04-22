import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type {
  Anime,
  JikanPagination,
  JikanTopAnimeResponse,
} from '../types/anime.ts'
import { JIKAN_BASE_URL } from '../config/jikanEnv.ts'
import { fetchJikan, jikanErrorMessage } from '../lib/jikanFetch.ts'

const LIMIT = '12'

export type ListFeedState =
  | { kind: 'top' }
  | { kind: 'title'; q: string }
  | { kind: 'studio'; producerId: number }
  | { kind: 'year'; year: number }

function buildListUrl(state: ListFeedState, page: number): string {
  const pageStr = String(page)
  if (state.kind === 'top') {
    return `${JIKAN_BASE_URL}/top/anime?${new URLSearchParams({ limit: LIMIT, page: pageStr })}`
  }
  if (state.kind === 'title') {
    return `${JIKAN_BASE_URL}/anime?${new URLSearchParams({ limit: LIMIT, page: pageStr, q: state.q })}`
  }
  if (state.kind === 'studio') {
    return `${JIKAN_BASE_URL}/anime?${new URLSearchParams({ limit: LIMIT, page: pageStr, producers: String(state.producerId) })}`
  }
  const y = state.year
  return `${JIKAN_BASE_URL}/anime?${new URLSearchParams({ limit: LIMIT, page: pageStr, start_date: `${y}-01-01`, end_date: `${y}-12-31` })}`
}

function pageFromSearchParams(sp: URLSearchParams): number {
  const raw = sp.get('page')
  if (raw === null || raw === '') return 1
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

export function useAnimeFeed() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = pageFromSearchParams(searchParams)

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, next)
      setSearchParams((prev) => {
        const q = new URLSearchParams(prev)
        if (clamped <= 1) q.delete('page')
        else q.set('page', String(clamped))
        return q
      }, { replace: false })
    },
    [setSearchParams],
  )

  const resetPage = useCallback(() => {
    setSearchParams((prev) => {
      const q = new URLSearchParams(prev)
      q.delete('page')
      return q
    }, { replace: true })
  }, [setSearchParams])

  const [listState, setListState] = useState<ListFeedState>({ kind: 'top' })
  const [animes, setAnimes] = useState<Anime[]>([])
  const [pagination, setPagination] = useState<JikanPagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const feedUrl = useMemo(() => buildListUrl(listState, page), [listState, page])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void (async () => {
      try {
        const res = await fetchJikan(feedUrl)
        if (!res.ok) throw new Error(jikanErrorMessage(res.status))
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
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [feedUrl])

  useEffect(() => {
    if (pagination === null) return
    const last = pagination.last_visible_page
    if (last >= 1 && page > last) goToPage(last)
  }, [pagination, page, goToPage])

  const skeletonCount = Number.parseInt(LIMIT, 10) || 12

  return {
    animes,
    pagination,
    loading,
    error,
    page,
    goToPage,
    resetPage,
    listState,
    setListState,
    setError,
    skeletonCount,
  }
}
