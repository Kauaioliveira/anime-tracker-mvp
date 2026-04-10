/**
 * Home page horizontal spotlight strip (one mode only).
 * - 'this_season': TV anime in the current MAL season (good for “what’s new”).
 * - 'top_scores': Highest MAL scores (classic “best rated” rail).
 *
 * Other ideas for later: “Most popular”, “Upcoming next season”, genre picks.
 */
export type SpotlightMode = 'this_season' | 'top_scores'

const SPOTLIGHT_MODE: SpotlightMode = 'this_season'

const SPOTLIGHT_LIMIT = '16'

export function getSpotlightFeedUrl(jikanBase: string): string {
  if (SPOTLIGHT_MODE === 'top_scores') {
    const params = new URLSearchParams({
      order_by: 'score',
      sort: 'desc',
      limit: SPOTLIGHT_LIMIT,
    })
    return `${jikanBase}/anime?${params.toString()}`
  }
  const params = new URLSearchParams({ limit: SPOTLIGHT_LIMIT })
  return `${jikanBase}/seasons/now?${params.toString()}`
}

export function getSpotlightCopy(): {
  title: string
  hint: string
  mode: SpotlightMode
} {
  if (SPOTLIGHT_MODE === 'top_scores') {
    return {
      title: 'Highest scores',
      hint: 'Top-scoring anime on MyAnimeList. Scroll sideways or use the horizontal scrollbar to see more titles.',
      mode: 'top_scores',
    }
  }
  return {
    title: 'This season',
    hint: 'TV anime airing this season. Scroll sideways or use the horizontal scrollbar to see more titles.',
    mode: 'this_season',
  }
}
