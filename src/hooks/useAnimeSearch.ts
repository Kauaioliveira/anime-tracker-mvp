import { useCallback, useState } from 'react'
import type { SearchMode } from '../types/searchMode.ts'
import type { JikanProducerSearchResponse } from '../types/anime.ts'
import { JIKAN_BASE_URL } from '../config/jikanEnv.ts'
import { fetchJikan, jikanErrorMessage } from '../lib/jikanFetch.ts'
import type { ListFeedState } from './useAnimeFeed.ts'

type UseAnimeSearchOptions = {
  resetPage: () => void
  setListState: (state: ListFeedState) => void
  setFeedError: (error: string | null) => void
}

export function useAnimeSearch({
  resetPage,
  setListState,
  setFeedError,
}: UseAnimeSearchOptions) {
  const [mode, setMode] = useState<SearchMode>('title')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleModeChange = useCallback(
    (next: SearchMode) => {
      setMode(next)
      setQuery('')
      setListState({ kind: 'top' })
      resetPage()
      setError(null)
      setFeedError(null)
    },
    [resetPage, setListState, setFeedError],
  )

  /** Apply a search described by explicit mode + query (used to sync from URL). */
  const applySearchFromUrl = useCallback(
    async (urlMode: SearchMode, raw: string) => {
      const trimmed = raw.trim()
      setMode(urlMode)
      setQuery(trimmed)
      resetPage()
      setError(null)
      setFeedError(null)

      if (urlMode === 'title') {
        setListState(trimmed === '' ? { kind: 'top' } : { kind: 'title', q: trimmed })
        return
      }

      if (urlMode === 'year') {
        if (trimmed === '') {
          setListState({ kind: 'top' })
          return
        }
        const y = Number.parseInt(trimmed, 10)
        const maxY = new Date().getFullYear() + 2
        if (!Number.isFinite(y) || y < 1917 || y > maxY) {
          setError(`Enter a year between 1917 and ${maxY}.`)
          return
        }
        setListState({ kind: 'year', year: y })
        return
      }

      if (trimmed === '') {
        setListState({ kind: 'top' })
        return
      }

      setBusy(true)
      try {
        const params = new URLSearchParams({ q: trimmed })
        const res = await fetchJikan(`${JIKAN_BASE_URL}/producers?${params}`)
        if (!res.ok) throw new Error(jikanErrorMessage(res.status))
        const json = (await res.json()) as JikanProducerSearchResponse
        const first = json.data?.[0]
        if (first === undefined) {
          setError('No studio found. Try a different name.')
          return
        }
        setListState({ kind: 'studio', producerId: first.mal_id })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to look up studio')
      } finally {
        setBusy(false)
      }
    },
    [resetPage, setListState, setFeedError],
  )

  const handleSearch = useCallback(async () => {
    const raw = query.trim()
    resetPage()
    setError(null)

    if (mode === 'title') {
      setListState(raw === '' ? { kind: 'top' } : { kind: 'title', q: raw })
      return
    }

    if (mode === 'year') {
      if (raw === '') {
        setListState({ kind: 'top' })
        return
      }
      const y = Number.parseInt(raw, 10)
      const maxY = new Date().getFullYear() + 2
      if (!Number.isFinite(y) || y < 1917 || y > maxY) {
        setError(`Enter a year between 1917 and ${maxY}.`)
        return
      }
      setListState({ kind: 'year', year: y })
      return
    }

    if (raw === '') {
      setListState({ kind: 'top' })
      return
    }

    setBusy(true)
    try {
      const params = new URLSearchParams({ q: raw })
      const res = await fetchJikan(`${JIKAN_BASE_URL}/producers?${params}`)
      if (!res.ok) throw new Error(jikanErrorMessage(res.status))
      const json = (await res.json()) as JikanProducerSearchResponse
      const first = json.data?.[0]
      if (first === undefined) {
        setError('No studio found. Try a different name.')
        return
      }
      setListState({ kind: 'studio', producerId: first.mal_id })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to look up studio')
    } finally {
      setBusy(false)
    }
  }, [query, mode, resetPage, setListState])

  return {
    mode,
    query,
    setQuery,
    busy,
    error,
    handleModeChange,
    handleSearch,
    applySearchFromUrl,
  }
}
