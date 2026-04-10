import { Routes, Route } from 'react-router-dom'
import AppLayout from './layout/AppLayout.tsx'
import HomePage from './pages/HomePage.tsx'
import AnimeDetailPage from './pages/AnimeDetailPage.tsx'
import FavoritesPage from './pages/FavoritesPage.tsx'
import WatchedPage from './pages/WatchedPage.tsx'
import PlannedPage from './pages/PlannedPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/anime/:id" element={<AnimeDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/watched" element={<WatchedPage />} />
        <Route path="/planned" element={<PlannedPage />} />
      </Route>
    </Routes>
  )
}
