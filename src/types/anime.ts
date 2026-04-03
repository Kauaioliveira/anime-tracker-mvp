/** Minimal fields from Jikan v4 (e.g. /v4/top/anime) */
export type Anime = {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
    }
  }
}

export type JikanTopAnimeResponse = {
  data: Anime[]
}

/** Resposta GET /v4/anime/{id} — o anime vem em .data */
export type JikanAnimeDetailResponse = {
  data: AnimeDetail
}

export type AnimeDetail = {
  mal_id: number
  title: string
  synopsis: string | null
  episodes: number | null
  score: number | null
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
}
