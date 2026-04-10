import { Link } from 'react-router-dom'
import type { FavoriteAnime } from '../types/anime.ts'
import { useUserListSkeletonGate } from '../hooks/useUserListSkeletonGate.ts'
import AnimeListSkeleton from './AnimeListSkeleton.tsx'

type UserSavedAnimeListProps = {
  title: string
  emptyMessage: string
  items: FavoriteAnime[]
}

export default function UserSavedAnimeList({
  title,
  emptyMessage,
  items,
}: UserSavedAnimeListProps) {
  const showSkeleton = useUserListSkeletonGate(items.length > 0)
  const skeletonCount = Math.min(items.length, 12)

  return (
    <main className="app__main">
      <h1 className="anime-detail__title">{title}</h1>

      {items.length === 0 ? (
        <p className="anime-list__empty">{emptyMessage}</p>
      ) : showSkeleton ? (
        <AnimeListSkeleton count={skeletonCount} />
      ) : (
        <ul className="anime-list">
          {items.map((item) => (
            <li key={item.mal_id}>
              <article className="anime-card">
                <Link
                  to={`/anime/${item.mal_id}`}
                  className="anime-card__link"
                >
                  <img
                    className="anime-card__img"
                    src={item.image_url}
                    alt=""
                    width={225}
                    height={318}
                  />
                  <h2 className="anime-card__title">{item.title}</h2>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
