import type { Anime } from '../types/anime.ts'
import AnimeCard from './AnimeCard.tsx'

type AnimeListProps = {
  animes: Anime[]
}

export default function AnimeList({ animes }: AnimeListProps) {
  if (animes.length === 0) {
    return (
      <p className="anime-list__empty">No anime to show.</p>
    )
  }

  return (
    <ul className="anime-list">
      {animes.map((anime) => (
        <li key={anime.mal_id}>
          <AnimeCard anime={anime} />
        </li>
      ))}
    </ul>
  )
}
