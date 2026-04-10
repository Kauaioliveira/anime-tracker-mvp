import { useUserLists } from '../context/UserListsContext.tsx'
import UserSavedAnimeList from '../components/UserSavedAnimeList.tsx'

export default function PlannedPage() {
  const { planned } = useUserLists()

  return (
    <UserSavedAnimeList
      title="Plan to watch"
      emptyMessage="Your queue is empty. Add anime from the detail page."
      items={planned}
    />
  )
}
