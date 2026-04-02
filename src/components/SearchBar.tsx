type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <form
      className="search-bar"
      role="search"
      aria-label="Search anime"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <input
        className="search-bar__input"
        type="search"
        placeholder="Search by title…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="search-bar__btn">
        Search
      </button>
    </form>
  )
}
