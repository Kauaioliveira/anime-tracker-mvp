import { useUserLists } from '../context/UserListsContext.tsx'
import UserSavedAnimeList from '../components/user/UserSavedAnimeList.tsx'

export default function WatchedPage() {
  const { watched } = useUserLists()

  return (
    <UserSavedAnimeList
      title="Watched"
      emptyMessage="No watched anime yet. Mark titles as watched from the detail page."
      items={watched}
    />
  )
}
