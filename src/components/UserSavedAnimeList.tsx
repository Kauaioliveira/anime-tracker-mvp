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
    <main className="mx-auto max-w-[1200px] px-5 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-4 ps-[max(1.25rem,env(safe-area-inset-left,0px))] pe-[max(1.25rem,env(safe-area-inset-right,0px))]">
      <h1 className="font-heading m-0 text-[clamp(1.9rem,4vw+0.45rem,2.9rem)] font-bold leading-tight tracking-wide text-[var(--text-h)] [overflow-wrap:anywhere] break-words">
        {title}
      </h1>

      {items.length === 0 ? (
        <p className="mt-4 text-[var(--text)]">{emptyMessage}</p>
      ) : showSkeleton ? (
        <div className="mt-4">
          <AnimeListSkeleton count={skeletonCount} />
        </div>
      ) : (
        <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-[clamp(0.65rem,2vw,1rem)] p-0 min-[480px]:grid-cols-3 min-[720px]:grid-cols-4 min-[1024px]:grid-cols-6">
          {items.map((item) => (
            <li key={item.mal_id}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg)]">
                <Link
                  to={`/anime/${item.mal_id}`}
                  className="flex min-h-0 flex-1 flex-col text-inherit no-underline"
                >
                  <img
                    className="block aspect-[225/318] w-full shrink-0 object-cover"
                    src={item.image_url}
                    alt=""
                    width={225}
                    height={318}
                  />
                  <h2 className="line-clamp-3 min-h-[calc(0.9rem*1.25*3)] px-2.5 pb-2 pt-2 text-[0.96rem] font-semibold leading-snug tracking-tight text-[var(--text-h)] [overflow-wrap:anywhere] break-words">
                    {item.title}
                  </h2>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
