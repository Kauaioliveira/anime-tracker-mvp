import { useCallback, useState } from 'react'
import type { FavoriteAnime } from '../types/anime.ts'

function readFromStorage(key: string): FavoriteAnime[] {
  try {
    const raw = localStorage.getItem(key)
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

function writeToStorage(key: string, items: FavoriteAnime[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

export function usePersistentAnimeList(storageKey: string) {
  const [items, setItems] = useState<FavoriteAnime[]>(() =>
    readFromStorage(storageKey),
  )

  const persist = useCallback(
    (next: FavoriteAnime[]) => {
      setItems(next)
      writeToStorage(storageKey, next)
    },
    [storageKey],
  )

  const isInList = useCallback(
    (mal_id: number) => items.some((f) => f.mal_id === mal_id),
    [items],
  )

  const add = useCallback(
    (item: FavoriteAnime) => {
      if (items.some((f) => f.mal_id === item.mal_id)) {
        return
      }
      persist([...items, item])
    },
    [items, persist],
  )

  const remove = useCallback(
    (mal_id: number) => {
      persist(items.filter((f) => f.mal_id !== mal_id))
    },
    [items, persist],
  )

  const toggle = useCallback(
    (item: FavoriteAnime) => {
      if (isInList(item.mal_id)) {
        remove(item.mal_id)
      } else {
        add(item)
      }
    },
    [isInList, add, remove],
  )

  return {
    items,
    isInList,
    add,
    remove,
    toggle,
  }
}
