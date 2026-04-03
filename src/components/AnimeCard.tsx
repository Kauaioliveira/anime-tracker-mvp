import { Link } from 'react-router-dom'
import type { Anime } from '../types/anime.ts'

type AnimeCardProps = {
  anime: Anime
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const { title, images, mal_id } = anime
  const src = images.jpg.image_url

  return (
    <article className="anime-card">
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