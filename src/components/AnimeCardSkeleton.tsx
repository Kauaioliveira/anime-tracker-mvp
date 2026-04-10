export default function AnimeCardSkeleton() {
  return (
    <article className="anime-card anime-card--skeleton" aria-hidden>
      <div className="skeleton skeleton--card-poster" />
      <div className="skeleton skeleton--card-title" />
      <div className="skeleton skeleton--card-meta" />
    </article>
  )
}
