import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { AnimeDetail, JikanAnimeDetailResponse } from '../types/anime.ts'

export default function AnimeDetailPage() {
  const { id } = useParams()
  const [anime, setAnime] = useState<AnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === undefined) {
      setError('Missing id')
      setLoading(false)
      return
    }

    const animeId = id

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime/${encodeURIComponent(animeId)}`,
        )
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const json = (await res.json()) as JikanAnimeDetailResponse
        if (!cancelled) {
          setAnime(json.data)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load')
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
  }, [id])

  return (
    <div className="app">
      <main className="app__main anime-detail">
        <p>
          <Link to="/">← Back to list</Link>
        </p>

        {loading && <p className="app__status">Loading…</p>}
        {error && (
          <p className="app__status app__status--error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && anime !== null && (
          <>
            <h1 className="anime-detail__title">{anime.title}</h1>
            <div className="anime-detail__layout">
              <img
                className="anime-detail__img"
                src={anime.images.jpg.large_image_url}
                alt=""
                width={300}
              />
              <div>
                <p>
                  <strong>Score:</strong> {anime.score ?? '—'}
                </p>
                <p>
                  <strong>Episodes:</strong> {anime.episodes ?? '—'}
                </p>
                <p className="anime-detail__synopsis">
                  {anime.synopsis ?? 'No synopsis.'}
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}