import { Link } from 'react-router-dom'
import { CalendarDays, Trophy } from 'lucide-react'
import type { SpotlightMode } from '../config/homeSpotlight.ts'
import type { Anime } from '../types/anime.ts'

type AnimeScrollRowProps = {
  title: string
  hint: string
  animes: Anime[]
  spotlightMode: SpotlightMode
}

export default function AnimeScrollRow({
  title,
  hint,
  animes,
  spotlightMode,
}: AnimeScrollRowProps) {
  if (animes.length === 0) {
    return null
  }

  const sectionId = 'spotlight-anime-heading'
  const hintId = 'spotlight-anime-hint'
  const countId = 'spotlight-anime-count'
  const TitleIcon = spotlightMode === 'top_scores' ? Trophy : CalendarDays

  return (
    <section
      className="scroll-row"
      aria-labelledby={sectionId}
      aria-describedby={`${hintId} ${countId}`}
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
        <p id={countId} className="visually-hidden">
          Horizontal row with {animes.length}{' '}
          {animes.length === 1 ? 'title' : 'titles'}.
        </p>
      </div>
      <div className="scroll-row__viewport">
        <ul className="scroll-row__track">
          {animes.map((anime) => (
            <li key={anime.mal_id} className="scroll-row__item">
              <Link
                to={`/anime/${anime.mal_id}`}
                className="scroll-row__card"
              >
                <div className="scroll-row__poster-wrap">
                  <img
                    className="scroll-row__img"
                    src={anime.images.jpg.image_url}
                    alt=""
                    loading="lazy"
                    width={160}
                    height={227}
                  />
                  <div className="scroll-row__poster-shade" aria-hidden />
                  {anime.score != null && typeof anime.score === 'number' && (
                    <span className="scroll-row__score">
                      <span className="scroll-row__score-star" aria-hidden>
                        ★
                      </span>
                      {anime.score.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="scroll-row__card-title">{anime.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
