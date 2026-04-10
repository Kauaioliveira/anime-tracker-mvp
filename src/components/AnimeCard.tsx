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
    <article className="anime-card">
      <button
        type="button"
        className="anime-card__fav"
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
            className="anime-card__fav-icon anime-card__fav-icon--on"
            fill="currentColor"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : (
          <Star size={20} className="anime-card__fav-icon" aria-hidden />
        )}
      </button>

      <Link
        to={`/anime/${mal_id}`}
        className="anime-card__link"
        title={title}
      >
        <img
          className="anime-card__img"
          src={src}
          alt=""
          loading="lazy"
          width={225}
          height={318}
        />
        <div className="anime-card__body">
          <h2 className="anime-card__title">{title}</h2>
          <p className="anime-card__meta" title={metaTitle}>
            {yearLabel !== null && (
              <span className="anime-card__meta-item">{yearLabel}</span>
            )}
            {yearLabel !== null && studioLine !== null && (
              <span className="anime-card__meta-sep" aria-hidden>
                {' · '}
              </span>
            )}
            {studioLine !== null && (
              <span className="anime-card__meta-item">{studioLine}</span>
            )}
            {metaTitle === undefined && '\u00A0'}
          </p>
        </div>
      </Link>
    </article>
  )
}
