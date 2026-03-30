import { useState } from 'react'
import Header from './Header.tsx'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main>
      <Header
        title="Anime Tracker"
        description="Acompanhe seus animes favoritos e torne sua experiência de assistir animes mais divertida."
      />

      <section>
        <label htmlFor="search">Buscar anime</label>
        <input
          id="search"
          type="text"
          placeholder="Digite o nome..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p>
          Você digitou: <strong>{searchQuery || '(nada ainda)'}</strong>
        </p>
      </section>
    </main>
  )
}

export default App