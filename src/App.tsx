import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import AnimeDetailPage from './pages/AnimeDetailPage.tsx'
import FavoritesPage from './pages/FavoritesPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/anime/:id" element={<AnimeDetailPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Routes>
  )
}