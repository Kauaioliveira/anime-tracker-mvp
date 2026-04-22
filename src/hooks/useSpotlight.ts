import { useEffect, useMemo, useState } from 'react'
import {
  getSpotlightCopy,
  getSpotlightFeedUrl,
} from '../config/homeSpotlight.ts'
import { JIKAN_BASE_URL } from '../config/jikanEnv.ts'
import type { Anime, JikanTopAnimeResponse } from '../types/anime.ts'
import { fetchJikan } from '../lib/jikanFetch.ts'
const STAGGER_MS = 1100

export function useSpotlight() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const copy = useMemo(() => getSpotlightCopy(), [])

  useEffect(() => {
    let cancelled = false
    const timerId = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await fetchJikan(getSpotlightFeedUrl(JIKAN_BASE_URL))
          if (res.ok) {
            const json = (await res.json()) as JikanTopAnimeResponse
            if (!cancelled) setAnimes(json.data)
          } else if (!cancelled) {
            setAnimes([])
          }
        } catch {
          if (!cancelled) setAnimes([])
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()
    }, STAGGER_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timerId)
    }
  }, [])

  return { animes, loading, copy }
}
