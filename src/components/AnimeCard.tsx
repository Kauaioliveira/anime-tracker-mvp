import { Link } from 'react-router-dom'
import type { Anime } from '../types/anime.ts'
import { useFavoritesContext } from '../context/FavoritesContext.tsx'

type AnimeCardProps = {
  anime: Anime
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const { title, images, mal_id } = anime
  const src = images.jpg.image_url
  const { isFavorite, toggleFavorite } = useFavoritesContext()
  const fav = isFavorite(mal_id)

  const favoriteItem = {
    mal_id,
    title,
    image_url: src,
  }

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
        {fav ? '★' : '☆'}
      </button>

      <Link to={`/anime/${mal_id}`} className="anime-card__link">
        <img
          className="anime-card__img"
          src={src}
          alt=""
          loading="lazy"
          width={225}
          height={318}
        />
        <h2 className="anime-card__title">{title}</h2>
      </Link>
    </article>
  )
}
