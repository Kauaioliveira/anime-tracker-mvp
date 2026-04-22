import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bookmark, CheckCircle2, Star } from 'lucide-react'
import { JIKAN_BASE_URL } from '../config/jikanEnv.ts'
import type { AnimeDetail, JikanAnimeDetailResponse } from '../types/anime.ts'
import { fetchJikan, jikanErrorMessage } from '../lib/jikanFetch.ts'
import { useUserLists } from '../context/UserListsContext.tsx'
import AnimeDetailSkeleton from '../components/anime/AnimeDetailSkeleton.tsx'

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

const listBtnBase =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-[0.85rem] py-2 font-inherit text-[0.94rem] font-medium text-[var(--text-h)] hover:enabled:border-[var(--accent-border)] hover:enabled:bg-[var(--accent-bg)] disabled:cursor-not-allowed disabled:opacity-50'

const listBtnAccent =
  ' border-[var(--accent-border)] bg-[var(--accent-bg)]'

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
          `${JIKAN_BASE_URL}/anime/${encodeURIComponent(animeId)}`,
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
    <main className="mx-auto max-w-[1200px] px-5 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-4 ps-[max(1.25rem,env(safe-area-inset-left,0px))] pe-[max(1.25rem,env(safe-area-inset-right,0px))]">
      {loading && <AnimeDetailSkeleton />}
      {error && (
        <p className="mb-4 mt-0 text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && anime !== null && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-4 max-sm:justify-start sm:justify-between">
            <h1 className="font-heading m-0 min-w-[200px] flex-1 text-[clamp(1.9rem,4vw+0.45rem,2.9rem)] font-bold leading-tight tracking-wide text-[var(--text-h)] [overflow-wrap:anywhere] break-words">
              {anime.title}
            </h1>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2 max-sm:justify-start">
              <button
                type="button"
                className={
                  listBtnBase +
                  (isFavorite(anime.mal_id) ? listBtnAccent : '')
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
                    className="shrink-0 text-amber-600 dark:text-amber-300"
                    fill="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : (
                  <Star
                    size={20}
                    className="shrink-0 text-[var(--text-h)]"
                    aria-hidden
                  />
                )}
                <span className="whitespace-nowrap">
                  {isFavorite(anime.mal_id)
                    ? 'In favorites'
                    : 'Favorites'}
                </span>
              </button>

              <button
                type="button"
                className={
                  listBtnBase +
                  (isWatched(anime.mal_id) ? listBtnAccent : '')
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
                  className={
                    'shrink-0 text-[var(--text-h)]' +
                    (isWatched(anime.mal_id)
                      ? ' text-green-600 dark:text-green-400'
                      : '')
                  }
                  aria-hidden
                  strokeWidth={1.75}
                />
                <span className="whitespace-nowrap">
                  {isWatched(anime.mal_id) ? 'Watched' : 'Mark watched'}
                </span>
              </button>

              <button
                type="button"
                className={
                  listBtnBase +
                  (isPlanned(anime.mal_id) ? listBtnAccent : '')
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
                  className="shrink-0 text-[var(--text-h)]"
                  aria-hidden
                  strokeWidth={1.75}
                  fill={isPlanned(anime.mal_id) ? 'currentColor' : 'none'}
                />
                <span className="whitespace-nowrap">
                  {isPlanned(anime.mal_id)
                    ? 'On plan to watch'
                    : 'Plan to watch'}
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-6">
            <img
              className="max-w-full rounded-[10px]"
              src={anime.images.jpg.large_image_url}
              alt=""
              width={300}
            />
            <div className="text-[var(--text)]">
              <p>
                <strong className="text-[var(--text-h)]">Aired:</strong>{' '}
                {formatAired(anime)}
              </p>
              <p>
                <strong className="text-[var(--text-h)]">Studios:</strong>{' '}
                {anime.studios !== undefined && anime.studios.length > 0
                  ? anime.studios.map((s) => s.name).join(', ')
                  : '—'}
              </p>
              <p>
                <strong className="text-[var(--text-h)]">Score:</strong>{' '}
                {anime.score ?? '—'}
              </p>
              <p>
                <strong className="text-[var(--text-h)]">Episodes:</strong>{' '}
                {anime.episodes ?? '—'}
              </p>
              <p className="max-w-[50rem] text-base leading-relaxed text-[var(--text)]">
                {anime.synopsis ?? 'No synopsis.'}
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
