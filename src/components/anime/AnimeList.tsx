import type { Anime } from '../../types/anime.ts'
import AnimeCard from './AnimeCard.tsx'

type AnimeListProps = {
  animes: Anime[]
}

export default function AnimeList({ animes }: AnimeListProps) {
  if (animes.length === 0) {
    return (
      <p className="m-0 text-[var(--text)]">No anime to show.</p>
    )
  }

  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-[clamp(0.65rem,2vw,1rem)] p-0 min-[480px]:grid-cols-3 min-[720px]:grid-cols-4 min-[1024px]:grid-cols-6">
      {animes.map((anime) => (
        <li key={anime.mal_id}>
          <AnimeCard anime={anime} />
        </li>
      ))}
    </ul>
  )
}
