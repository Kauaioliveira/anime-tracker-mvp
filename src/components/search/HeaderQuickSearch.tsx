import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useHeaderSuggestions } from '../../hooks/useHeaderSuggestions.ts'

export default function HeaderQuickSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const wrapperRef = useRef<HTMLFormElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const { suggestions, loading, clear } = useHeaderSuggestions(value)

  useEffect(() => {
    if (location.pathname !== '/') {
      setValue('')
      return
    }
    const q = new URLSearchParams(location.search).get('q')
    setValue(q ?? '')
  }, [location.pathname, location.search])

  useEffect(() => {
    if (suggestions.length > 0 && value.trim().length >= 2) {
      setOpen(true)
    }
  }, [suggestions, value])

  useEffect(() => {
    setActiveIdx(-1)
  }, [suggestions])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goToAnime = useCallback(
    (malId: number) => {
      setOpen(false)
      clear()
      navigate(`/anime/${malId}`)
    },
    [navigate, clear],
  )

  const submitSearch = useCallback(
    (q: string) => {
      setOpen(false)
      clear()
      if (q === '') {
        navigate({ pathname: '/', search: '' })
      } else {
        navigate({ pathname: '/', search: `?q=${encodeURIComponent(q)}` })
      }
    },
    [navigate, clear],
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (activeIdx >= 0 && activeIdx < suggestions.length) {
      goToAnime(suggestions[activeIdx]!.mal_id)
      return
    }
    submitSearch(value.trim())
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i < suggestions.length - 1 ? i + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i > 0 ? i - 1 : suggestions.length - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement | undefined
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  const showDropdown = open && suggestions.length > 0

  return (
    <form
      ref={wrapperRef}
      role="search"
      aria-label="Quick search by title"
      className="relative ms-auto flex min-w-0 max-w-[min(100%,20rem)] flex-[1_1_12rem] items-center gap-1.5 sm:max-w-sm"
      onSubmit={submit}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 text-[var(--text)] opacity-55"
          aria-hidden
        />
        <input
          type="search"
          name="header-q"
          placeholder="Search titles…"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="header-suggestions"
          aria-activedescendant={
            activeIdx >= 0 ? `sug-${suggestions[activeIdx]?.mal_id}` : undefined
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 && value.trim().length >= 2) setOpen(true)
          }}
          onKeyDown={onKeyDown}
          className="box-border w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2 pe-2 ps-8 font-inherit text-[0.88rem] text-[var(--text-h)] outline-none placeholder:text-[var(--text)] placeholder:opacity-55 focus:border-[var(--accent-border)] focus:ring-1 focus:ring-[var(--accent-border)]"
        />

        {showDropdown && (
          <ul
            ref={listRef}
            id="header-suggestions"
            role="listbox"
            className="absolute start-0 top-[calc(100%+4px)] z-[200] max-h-80 w-full min-w-[280px] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-lg sm:min-w-[340px]"
          >
            {suggestions.map((s, i) => (
              <li
                key={s.mal_id}
                id={`sug-${s.mal_id}`}
                role="option"
                aria-selected={i === activeIdx}
                onMouseDown={(e) => {
                  e.preventDefault()
                  goToAnime(s.mal_id)
                }}
                onMouseEnter={() => setActiveIdx(i)}
                className={[
                  'flex cursor-pointer items-center gap-3 px-3 py-2 text-[0.88rem] text-[var(--text-h)] transition-colors',
                  i === activeIdx
                    ? 'bg-[var(--accent-bg)]'
                    : 'hover:bg-[var(--accent-bg)]/50',
                ].join(' ')}
              >
                <img
                  src={s.image_url}
                  alt=""
                  className="h-12 w-9 shrink-0 rounded object-cover"
                  loading="lazy"
                />
                <span className="line-clamp-2 min-w-0 break-words leading-snug">
                  {s.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        {loading && value.trim().length >= 2 && (
          <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[0.7rem] text-[var(--text)] opacity-60">
            …
          </span>
        )}
      </div>

      <button
        type="submit"
        className="shrink-0 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3 py-2 font-inherit text-[0.85rem] font-semibold text-[var(--text-h)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-border)]"
      >
        Go
      </button>
    </form>
  )
}
