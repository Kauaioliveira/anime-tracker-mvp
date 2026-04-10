import { CalendarDays, Trophy } from 'lucide-react'
import type { SpotlightMode } from '../config/homeSpotlight.ts'

const PLACEHOLDER_COUNT = 8

type AnimeScrollRowSkeletonProps = {
  title: string
  hint: string
  spotlightMode: SpotlightMode
}

export default function AnimeScrollRowSkeleton({
  title,
  hint,
  spotlightMode,
}: AnimeScrollRowSkeletonProps) {
  const sectionId = 'spotlight-anime-heading-sk'
  const hintId = 'spotlight-anime-hint-sk'
  const TitleIcon = spotlightMode === 'top_scores' ? Trophy : CalendarDays

  return (
    <section
      className="scroll-row"
      aria-labelledby={sectionId}
      aria-describedby={hintId}
      aria-busy="true"
    >
      <div className="scroll-row__header">
        <div className="scroll-row__title-row">
          <TitleIcon
            size={20}
            className="scroll-row__title-icon"
            strokeWidth={1.75}
            aria-hidden
          />
          <h2 id={sectionId} className="scroll-row__title">
            {title}
          </h2>
        </div>
        <p id={hintId} className="scroll-row__hint">
          {hint}
        </p>
        <p className="visually-hidden">Loading highlights.</p>
      </div>
      <div className="scroll-row__viewport">
        <ul className="scroll-row__track">
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <li key={`scroll-sk-${i}`} className="scroll-row__item">
              <div className="scroll-row__card scroll-row__card--skeleton">
                <div className="scroll-row__poster-wrap">
                  <div className="skeleton skeleton--scroll-poster" />
                </div>
                <div className="skeleton skeleton--scroll-title" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
