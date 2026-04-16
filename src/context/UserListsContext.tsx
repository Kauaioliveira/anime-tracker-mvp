/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { usePersistentAnimeList } from '../hooks/usePersistentAnimeList.ts'
import type { FavoriteAnime } from '../types/anime.ts'

const KEY_FAVORITES = 'animezone-favorites'
const KEY_WATCHED = 'animezone-watched'
const KEY_PLANNED = 'animezone-planned'

type UserListsContextValue = {
  favorites: FavoriteAnime[]
  watched: FavoriteAnime[]
  planned: FavoriteAnime[]
  isFavorite: (mal_id: number) => boolean
  toggleFavorite: (item: FavoriteAnime) => void
  isWatched: (mal_id: number) => boolean
  toggleWatched: (item: FavoriteAnime) => void
  isPlanned: (mal_id: number) => boolean
  togglePlanned: (item: FavoriteAnime) => void
}

const UserListsContext = createContext<UserListsContextValue | null>(null)

export function UserListsProvider({ children }: { children: ReactNode }) {
  const fav = usePersistentAnimeList(KEY_FAVORITES)
  const watched = usePersistentAnimeList(KEY_WATCHED)
  const planned = usePersistentAnimeList(KEY_PLANNED)

  const value = useMemo(
    () =>
      ({
        favorites: fav.items,
        isFavorite: fav.isInList,
        toggleFavorite: fav.toggle,
        watched: watched.items,
        isWatched: watched.isInList,
        toggleWatched: watched.toggle,
        planned: planned.items,
        isPlanned: planned.isInList,
        togglePlanned: planned.toggle,
      }) satisfies UserListsContextValue,
    [
      fav.items,
      fav.isInList,
      fav.toggle,
      watched.items,
      watched.isInList,
      watched.toggle,
      planned.items,
      planned.isInList,
      planned.toggle,
    ],
  )

  return (
    <UserListsContext.Provider value={value}>{children}</UserListsContext.Provider>
  )
}

export function useUserLists() {
  const ctx = useContext(UserListsContext)
  if (ctx === null) {
    throw new Error('useUserLists must be used inside a UserListsProvider')
  }
  return ctx
}
