import { ScanSearch } from 'lucide-react'
import type { SearchMode } from '../types/searchMode.ts'

type SearchBarProps = {
  mode: SearchMode
  onModeChange: (mode: SearchMode) => void
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

const MODE_LABELS: Record<SearchMode, string> = {
  title: 'Title',
  studio: 'Studio',
  year: 'Year',
}

export default function SearchBar({
  mode,
  onModeChange,
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  const placeholder =
    mode === 'title'
      ? 'Search by title…'
      : mode === 'studio'
        ? 'Studio name (e.g. MAPPA, Bones)…'
        : 'Release year (e.g. 2023)…'

  const inputType = mode === 'year' ? 'number' : 'search'

  return (
    <form
      className="search-bar search-bar--with-filters"
      role="search"
      aria-label="Search anime"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <label className="search-bar__mode-label">
        <span className="visually-hidden">Search by</span>
        <select
          className="search-bar__select"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as SearchMode)}
          aria-label="Search by"
        >
          {(Object.keys(MODE_LABELS) as SearchMode[]).map((m) => (
            <option key={m} value={m}>
              {MODE_LABELS[m]}
            </option>
          ))}
        </select>
      </label>

      <input
        className="search-bar__input"
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        min={mode === 'year' ? 1917 : undefined}
        max={mode === 'year' ? new Date().getFullYear() + 2 : undefined}
      />

      <button
        type="submit"
        className="search-bar__btn"
        aria-label="Search"
      >
        <ScanSearch size={18} className="search-bar__btn-icon" aria-hidden />
      </button>
    </form>
  )
}
