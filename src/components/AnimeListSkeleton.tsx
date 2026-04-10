import AnimeCardSkeleton from './AnimeCardSkeleton.tsx'

const DEFAULT_COUNT = 12

type AnimeListSkeletonProps = {
  count?: number
}

export default function AnimeListSkeleton({
  count = DEFAULT_COUNT,
}: AnimeListSkeletonProps) {
  return (
    <ul className="anime-list" aria-busy="true" aria-label="Loading anime list">
      {Array.from({ length: count }, (_, i) => (
        <li key={`list-sk-${i}`}>
          <AnimeCardSkeleton />
        </li>
      ))}
    </ul>
  )
}
