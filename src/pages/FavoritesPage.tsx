import { Link } from 'react-router-dom'
import { useFavoritesContext } from '../context/FavoritesContext.tsx'

export default function FavoritesPage() {
  const { favorites } = useFavoritesContext()

  return (
    <div className="app">
      <main className="app__main">
        <p>
          <Link to="/">← Back to list</Link>
        </p>

        <h1 className="anime-detail__title">Favorites</h1>

        {favorites.length === 0 ? (
          <p className="anime-list__empty">
            No favorites yet. Add some from the list or detail page.
          </p>
        ) : (
          <ul className="anime-list">
            {favorites.map((f) => (
              <li key={f.mal_id}>
                <article className="anime-card">
                  <Link
                    to={`/anime/${f.mal_id}`}
                    className="anime-card__link"
                  >
                    <img
                      className="anime-card__img"
                      src={f.image_url}
                      alt=""
                      width={225}
                      height={318}
                    />
                    <h2 className="anime-card__title">{f.title}</h2>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
