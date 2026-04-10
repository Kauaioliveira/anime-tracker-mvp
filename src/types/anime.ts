/** Named entity from Jikan (studio, producer, etc.) */
export type JikanNamedEntity = {
  mal_id: number
  name: string
  type?: string
}

/** Minimal fields from Jikan v4 (e.g. /v4/top/anime, /v4/anime) */
export type Anime = {
  mal_id: number
  title: string
  score?: number | null
  aired?: {
    from: string | null
    to: string | null
    string?: string
  }
  studios?: JikanNamedEntity[]
  images: {
    jpg: {
      image_url: string
    }
  }
}

/** Pagination on /v4/top/anime and /v4/anime list endpoints */
export type JikanPagination = {
  current_page: number
  last_visible_page: number
  has_next_page: boolean
}

export type JikanTopAnimeResponse = {
  pagination: JikanPagination
  data: Anime[]
}

/** GET /v4/anime/{id} — anime is in `.data` */
export type JikanAnimeDetailResponse = {
  data: AnimeDetail
}

/** Stored in localStorage for user lists */
export type FavoriteAnime = {
  mal_id: number
  title: string
  image_url: string
}

export type AnimeDetail = {
  mal_id: number
  title: string
  synopsis: string | null
  episodes: number | null
  score: number | null
  aired?: {
    from: string | null
    to: string | null
    string?: string
  }
  studios?: JikanNamedEntity[]
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
}

/** Item from GET /v4/producers?q= */
export type JikanProducerItem = {
  mal_id: number
  titles?: { type: string; title: string }[]
  title?: string
}

export type JikanProducerSearchResponse = {
  data: JikanProducerItem[]
}
