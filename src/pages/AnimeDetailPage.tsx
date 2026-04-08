import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { AnimeDetail, JikanAnimeDetailResponse } from '../types/anime.ts'
import { useFavoritesContext } from '../context/FavoritesContext.tsx'

function formatAired(detail: AnimeDetail): string {
  if (detail.aired?.string !== undefined && detail.aired.string !== '') {
    return detail.aired.string
  }
  const from = detail.aired?.from
  const to = detail.aired?.to
  if (from === null || from === undefined || from === '') {
    return '—'
  }
  if (to === null || to === undefined || to === '') {
    return from.slice(0, 10)
  }
  return `${from.slice(0, 10)} → ${to.slice(0, 10)}`
}

export default function AnimeDetailPage() {
  const { id } = useParams()
  const [anime, setAnime] = useState<AnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isFavorite, toggleFavorite } = useFavoritesContext()
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
            <div className="anime-detail__heading">
              <h1 className="anime-detail__title">{anime.title}</h1>
              <button
                type="button"
                className="anime-detail__fav-btn"
                aria-label={
                  isFavorite(anime.mal_id)
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
                onClick={() =>
                  toggleFavorite({
                    mal_id: anime.mal_id,
                    title: anime.title,
                    image_url: anime.images.jpg.image_url,
                  })
                }
              >
                {isFavorite(anime.mal_id) ? (
                  <Star
                    size={20}
                    className="anime-detail__fav-icon anime-detail__fav-icon--on"
                    fill="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : (
                  <Star size={20} className="anime-detail__fav-icon" aria-hidden />
                )}
                <span className="anime-detail__fav-label">
                  {isFavorite(anime.mal_id)
                    ? 'Remove from favorites'
                    : 'Add to favorites'}
                </span>
              </button>
            </div>
            <div className="anime-detail__layout">
              <img
                className="anime-detail__img"
                src={anime.images.jpg.large_image_url}
                alt=""
                width={300}
              />
              <div>
                <p>
                  <strong>Aired:</strong> {formatAired(anime)}
                </p>
                <p>
                  <strong>Studios:</strong>{' '}
                  {anime.studios !== undefined && anime.studios.length > 0
                    ? anime.studios.map((s) => s.name).join(', ')
                    : '—'}
                </p>
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