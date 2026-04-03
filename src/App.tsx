import { useEffect, useState } from 'react'
import Header from './Header.tsx'
import SearchBar from './components/SearchBar.tsx'
import AnimeList from './components/AnimeList.tsx'
import type { Anime, JikanTopAnimeResponse } from './types/anime.ts'

const TOP_ANIME_URL = 'https://api.jikan.moe/v4/top/anime?limit=12'

function buildSearchUrl(query: string) {
  const params = new URLSearchParams({ limit: '12', q: query })
  return `https://api.jikan.moe/v4/anime?${params.toString()}`
}

function App() {
  const [feedUrl, setFeedUrl] = useState(TOP_ANIME_URL)
  const [inputQuery, setInputQuery] = useState('')
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(feedUrl)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const json = (await res.json()) as JikanTopAnimeResponse
        if (!cancelled) {
          setAnimes(json.data)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [feedUrl])

  function handleSearch() {
    const q = inputQuery.trim()
    setFeedUrl(q === '' ? TOP_ANIME_URL : buildSearchUrl(q))
  }

  return (
    <div className="app">
      <Header
        title="Anime Tracker"
        description="Follow your favorite animes and make your anime-watching experience more fun."
      />

      <main className="app__main">
        <SearchBar
          value={inputQuery}
          onChange={setInputQuery}
          onSearch={handleSearch}
        />

        {loading && <p className="app__status">Loading…</p>}
        {error && (
          <p className="app__status app__status--error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && <AnimeList animes={animes} />}
      </main>
    </div>
  )
}

export default App
