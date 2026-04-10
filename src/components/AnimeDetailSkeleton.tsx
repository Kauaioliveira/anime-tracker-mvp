export default function AnimeDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading anime details">
      <div className="anime-detail__skeleton-heading">
        <div className="skeleton anime-detail__skeleton-title" />
        <div className="anime-detail__skeleton-actions">
          <div className="skeleton anime-detail__skeleton-btn" />
          <div className="skeleton anime-detail__skeleton-btn" />
          <div className="skeleton anime-detail__skeleton-btn" />
        </div>
      </div>
      <div className="anime-detail__skeleton-layout">
        <div className="skeleton anime-detail__skeleton-poster" />
        <div className="anime-detail__skeleton-copy">
          <div className="skeleton anime-detail__skeleton-line" />
          <div className="skeleton anime-detail__skeleton-line" />
          <div className="skeleton anime-detail__skeleton-line anime-detail__skeleton-line--short" />
          <div className="skeleton anime-detail__skeleton-line" />
          <div className="skeleton anime-detail__skeleton-line anime-detail__skeleton-line--synopsis" />
        </div>
      </div>
    </div>
  )
}
