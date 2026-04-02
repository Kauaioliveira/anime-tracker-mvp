export default function SearchBar() {
  return (
    <section className="search-bar" aria-label="Search bar (visual only)">
      <input
        className="search-bar__input"
        type="search"
        placeholder="Search anime (coming soon)"
        readOnly
      />
      <button type="button" className="search-bar__btn">
        Search
      </button>
    </section>
  )
}
