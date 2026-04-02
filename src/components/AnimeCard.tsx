import type { Anime } from '../types/anime.ts'

type AnimeCardProps = {
  anime: Anime
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const { title, images } = anime
  const src = images.jpg.image_url

  return (
    <article className="anime-card">
      <img
        className="anime-card__img"
        src={src}
        alt=""
        loading="lazy"
        width={225}
        height={318}
      />
      <h2 className="anime-card__title">{title}</h2>
    </article>
  )
}
