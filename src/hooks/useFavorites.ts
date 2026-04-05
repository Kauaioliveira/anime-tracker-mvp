import { useCallback, useState } from 'react'
import type { FavoriteAnime } from '../types/anime.ts'

const STORAGE_KEY = 'anime-tracker-favorites'

function readFromStorage(): FavoriteAnime[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed as FavoriteAnime[]
  } catch {
    return []
  }
}

function writeToStorage(items: FavoriteAnime[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>(() =>
    readFromStorage(),
  )

  const persist = useCallback((next: FavoriteAnime[]) => {
    setFavorites(next)
    writeToStorage(next)
  }, [])

  const isFavorite = useCallback(
    (mal_id: number) => favorites.some((f) => f.mal_id === mal_id),
    [favorites],
  )

  const addFavorite = useCallback(
    (item: FavoriteAnime) => {
      if (favorites.some((f) => f.mal_id === item.mal_id)) {
        return
      }
      persist([...favorites, item])
    },
    [favorites, persist],
  )

  const removeFavorite = useCallback(
    (mal_id: number) => {
      persist(favorites.filter((f) => f.mal_id !== mal_id))
    },
    [favorites, persist],
  )

  const toggleFavorite = useCallback(
    (item: FavoriteAnime) => {
      if (isFavorite(item.mal_id)) {
        removeFavorite(item.mal_id)
      } else {
        addFavorite(item)
      }
    },
    [isFavorite, addFavorite, removeFavorite],
  )

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
