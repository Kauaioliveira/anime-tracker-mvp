/* eslint-disable react-refresh/only-export-components -- hook must live next to provider */
import { createContext, useContext, type ReactNode } from 'react'
import { useFavorites } from '../hooks/useFavorites.ts'

type FavoritesContextValue = ReturnType<typeof useFavorites>

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const value = useFavorites()

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext)
  if (ctx === null) {
    throw new Error(
      'useFavoritesContext must be used inside a FavoritesProvider',
    )
  }
  return ctx
}
