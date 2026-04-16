import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { Anime } from '../types/anime.ts'
import { useUserLists } from '../context/UserListsContext.tsx'

type AnimeCardProps = {
  anime: Anime
}

function releaseYear(aired: Anime['aired']): string | null {
  const from = aired?.from
  if (from === null || from === undefined || from === '') {
    return null
  }
  const y = from.slice(0, 4)
  return /^\d{4}$/.test(y) ? y : null
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const { title, images, mal_id, aired, studios } = anime
  const src = images.jpg.image_url
  const { isFavorite, toggleFavorite } = useUserLists()
  const fav = isFavorite(mal_id)

  const favoriteItem = {
    mal_id,
    title,
    image_url: src,
  }

  const yearLabel = releaseYear(aired)
  const studioLine =
    studios !== undefined && studios.length > 0
      ? studios.map((s) => s.name).join(', ')
      : null

  const metaParts = [
    yearLabel ?? '',
    studioLine ?? '',
  ].filter(Boolean)
  const metaFull = metaParts.join(' · ')
  const metaTitle = metaFull.length > 0 ? metaFull : undefined

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg)]">
      <button
        type="button"
        className="absolute right-2 top-2 z-[2] cursor-pointer rounded-full border-none bg-[var(--bg)] px-2 py-1 text-base leading-none shadow-[0_1px_4px_rgba(0,0,0,0.15)] hover:enabled:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFavorite(favoriteItem)
        }}
      >
        {fav ? (
          <Star
            size={20}
            className="block text-amber-600 dark:text-amber-300"
            fill="currentColor"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : (
          <Star
            size={20}
            className="block text-[var(--text-h)]"
            aria-hidden
          />
        )}
      </button>

      <Link
        to={`/anime/${mal_id}`}
        className="flex min-h-0 flex-1 flex-col text-inherit no-underline"
        title={title}
      >
        <img
          className="block aspect-[225/318] w-full shrink-0 object-cover"
          src={src}
          alt=""
          loading="lazy"
          width={225}
          height={318}
        />
        <div className="flex min-h-0 flex-1 flex-col">
          <h2 className="line-clamp-3 min-h-[calc(0.9rem*1.25*3)] overflow-hidden px-2.5 pb-1 pt-2 text-[0.96rem] font-semibold leading-snug tracking-tight text-[var(--text-h)] break-words [overflow-wrap:anywhere]">
            {title}
          </h2>
          <p
            className="line-clamp-2 mt-auto min-h-[calc(0.75rem*1.3*2)] overflow-hidden px-2.5 pb-2 text-[0.8rem] leading-snug text-[var(--text)] break-words [overflow-wrap:anywhere]"
            title={metaTitle}
          >
            {yearLabel !== null && (
              <span className="break-words">{yearLabel}</span>
            )}
            {yearLabel !== null && studioLine !== null && (
              <span aria-hidden>{' · '}</span>
            )}
            {studioLine !== null && (
              <span className="break-words">{studioLine}</span>
            )}
            {metaTitle === undefined && '\u00A0'}
          </p>
        </div>
      </Link>
    </article>
  )
}
