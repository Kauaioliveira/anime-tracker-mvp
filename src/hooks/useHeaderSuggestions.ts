import { useEffect, useRef, useState } from 'react'
import { JIKAN_BASE_URL } from '../config/jikanEnv.ts'

export type Suggestion = {
  mal_id: number
  title: string
  image_url: string
}

const MIN_CHARS = 2
const DEBOUNCE_MS = 350
const LIMIT = 6

export function useHeaderSuggestions(raw: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const trimmed = raw.trim()

    if (trimmed.length < MIN_CHARS) {
      setSuggestions([])
      setLoading(false)
      return
    }

    setLoading(true)

    const timer = setTimeout(() => {
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl

      const params = new URLSearchParams({
        q: trimmed,
        limit: String(LIMIT),
        sfw: 'true',
        order_by: 'score',
        sort: 'desc',
      })

      fetch(`${JIKAN_BASE_URL}/anime?${params}`, { signal: ctrl.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then((json: { data?: { mal_id: number; title: string; images: { jpg: { image_url: string } } }[] }) => {
          const items: Suggestion[] = (json.data ?? []).map((d) => ({
            mal_id: d.mal_id,
            title: d.title,
            image_url: d.images.jpg.image_url,
          }))
          setSuggestions(items)
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return
          setSuggestions([])
        })
        .finally(() => setLoading(false))
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
    }
  }, [raw])

  const clear = () => setSuggestions([])

  return { suggestions, loading, clear }
}
