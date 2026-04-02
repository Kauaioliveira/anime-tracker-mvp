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
