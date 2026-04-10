import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bookmark, CheckCircle2, Star } from 'lucide-react'
import type { AnimeDetail, JikanAnimeDetailResponse } from '../types/anime.ts'
import { fetchJikan, jikanErrorMessage } from '../lib/jikanFetch.ts'
import { useUserLists } from '../context/UserListsContext.tsx'
import AnimeDetailSkeleton from '../components/AnimeDetailSkeleton.tsx'

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
  const {
    isFavorite,
    toggleFavorite,
    isWatched,
    toggleWatched,
    isPlanned,
    togglePlanned,
  } = useUserLists()

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
        const res = await fetchJikan(
          `https://api.jikan.moe/v4/anime/${encodeURIComponent(animeId)}`,
        )
        if (!res.ok) {
          throw new Error(jikanErrorMessage(res.status))
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
    <main className="app__main anime-detail">
      {loading && <AnimeDetailSkeleton />}
      {error && (
        <p className="app__status app__status--error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && anime !== null && (
        <>
          <div className="anime-detail__heading">
            <h1 className="anime-detail__title">{anime.title}</h1>
            <div className="anime-detail__actions">
              <button
                type="button"
                className={
                  'anime-detail__list-btn' +
                  (isFavorite(anime.mal_id)
                    ? ' anime-detail__list-btn--favorite'
                    : '')
                }
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
                    ? 'In favorites'
                    : 'Favorites'}
                </span>
              </button>

              <button
                type="button"
                className={
                  'anime-detail__list-btn' +
                  (isWatched(anime.mal_id)
                    ? ' anime-detail__list-btn--active'
                    : '')
                }
                aria-label={
                  isWatched(anime.mal_id)
                    ? 'Remove from watched'
                    : 'Mark as watched'
                }
                onClick={() =>
                  toggleWatched({
                    mal_id: anime.mal_id,
                    title: anime.title,
                    image_url: anime.images.jpg.image_url,
                  })
                }
              >
                <CheckCircle2
                  size={20}
                  className="anime-detail__list-icon"
                  aria-hidden
                  strokeWidth={1.75}
                />
                <span className="anime-detail__fav-label">
                  {isWatched(anime.mal_id) ? 'Watched' : 'Mark watched'}
                </span>
              </button>

              <button
                type="button"
                className={
                  'anime-detail__list-btn' +
                  (isPlanned(anime.mal_id)
                    ? ' anime-detail__list-btn--active'
                    : '')
                }
                aria-label={
                  isPlanned(anime.mal_id)
                    ? 'Remove from plan to watch'
                    : 'Add to plan to watch'
                }
                onClick={() =>
                  togglePlanned({
                    mal_id: anime.mal_id,
                    title: anime.title,
                    image_url: anime.images.jpg.image_url,
                  })
                }
              >
                <Bookmark
                  size={20}
                  className="anime-detail__list-icon"
                  aria-hidden
                  strokeWidth={1.75}
                  fill={isPlanned(anime.mal_id) ? 'currentColor' : 'none'}
                />
                <span className="anime-detail__fav-label">
                  {isPlanned(anime.mal_id)
                    ? 'On plan to watch'
                    : 'Plan to watch'}
                </span>
              </button>
            </div>
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
  )
}
