import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import AnimeDetailPage from './pages/AnimeDetailPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/anime/:id" element={<AnimeDetailPage />} />
    </Routes>
  )
}