import { useUserLists } from '../context/UserListsContext.tsx'
import UserSavedAnimeList from '../components/user/UserSavedAnimeList.tsx'

export default function FavoritesPage() {
  const { favorites } = useUserLists()

  return (
    <UserSavedAnimeList
      title="Favorites"
      emptyMessage="No favorites yet. Add some from the list or detail page."
      items={favorites}
    />
  )
}
