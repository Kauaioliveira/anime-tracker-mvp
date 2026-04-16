import AnimeCardSkeleton from './AnimeCardSkeleton.tsx'

const DEFAULT_COUNT = 12

type AnimeListSkeletonProps = {
  count?: number
}

export default function AnimeListSkeleton({
  count = DEFAULT_COUNT,
}: AnimeListSkeletonProps) {
  return (
    <ul
      className="m-0 grid list-none grid-cols-2 gap-[clamp(0.65rem,2vw,1rem)] p-0 min-[480px]:grid-cols-3 min-[720px]:grid-cols-4 min-[1024px]:grid-cols-6"
      aria-busy="true"
      aria-label="Loading anime list"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={`list-sk-${i}`}>
          <AnimeCardSkeleton />
        </li>
      ))}
    </ul>
  )
}
