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

/** Paginação em /v4/top/anime e /v4/anime (lista) */
export type JikanPagination = {
  current_page: number
  last_visible_page: number
  has_next_page: boolean
}

export type JikanTopAnimeResponse = {
  pagination: JikanPagination
  data: Anime[]
}

/** Resposta GET /v4/anime/{id} — o anime vem em .data */
export type JikanAnimeDetailResponse = {
  data: AnimeDetail
}

/** Guardado no localStorage (lista de favoritos) */
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
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
}
