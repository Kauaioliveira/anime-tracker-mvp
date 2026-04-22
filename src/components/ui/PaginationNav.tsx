import { useEffect, useState, type FormEvent } from 'react'
import type { JikanPagination } from '../../types/anime.ts'

type PageItem = number | 'ellipsis'

const VISIBLE_PAGES = 5

function buildPageItems(current: number, last: number): PageItem[] {
  if (last <= 1) return [1]

  if (last <= VISIBLE_PAGES + 2) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }

  const half = Math.floor(VISIBLE_PAGES / 2)
  let start = current - half
  let end = current + half

  if (start < 1) {
    start = 1
    end = VISIBLE_PAGES
  }
  if (end > last) {
    end = last
    start = last - VISIBLE_PAGES + 1
  }

  const out: PageItem[] = []

  if (start > 1) {
    out.push(1)
    if (start > 2) out.push('ellipsis')
  }

  for (let p = start; p <= end; p++) {
    out.push(p)
  }

  if (end < last) {
    if (end < last - 1) out.push('ellipsis')
    out.push(last)
  }

  return out
}

type PaginationNavProps = {
  pagination: JikanPagination
  onGoToPage: (page: number) => void
}

const pageBtnBase =
  'min-w-9 cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 font-inherit text-[0.92rem] font-medium text-[var(--text-h)] disabled:cursor-default disabled:opacity-100 hover:enabled:border-[var(--accent-border)] hover:enabled:bg-[var(--accent-bg)]'

const navBtnBase =
  'cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-[0.45rem] font-inherit text-[0.92rem] font-medium text-[var(--text-h)] hover:enabled:border-[var(--accent-border)] hover:enabled:bg-[var(--accent-bg)] disabled:cursor-not-allowed disabled:opacity-45'

const jumpInputClass =
  'w-[4.25rem] rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-[0.45rem] text-center font-inherit text-[0.92rem] text-[var(--text-h)] outline-none focus:border-[var(--accent-border)] focus:ring-1 focus:ring-[var(--accent-border)]'

export default function PaginationNav({
  pagination,
  onGoToPage,
}: PaginationNavProps) {
  const { current_page: current, last_visible_page: last, has_next_page } =
    pagination
  const items = buildPageItems(current, last)

  const [jumpInput, setJumpInput] = useState(String(current))

  useEffect(() => {
    setJumpInput(String(current))
  }, [current])

  const submitJump = (e: FormEvent) => {
    e.preventDefault()
    const n = Number.parseInt(jumpInput, 10)
    if (!Number.isFinite(n)) {
      setJumpInput(String(current))
      return
    }
    const clamped = Math.min(Math.max(1, n), last)
    onGoToPage(clamped)
    setJumpInput(String(clamped))
  }

  return (
    <nav
      className="mt-6 flex flex-col items-center gap-[0.65rem] py-3"
      aria-label="Page navigation"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-[0.85rem] gap-y-[0.65rem]">
        <div className="flex flex-wrap items-center gap-[0.35rem]">
          <button
            type="button"
            className={navBtnBase}
            disabled={current <= 1}
            onClick={() => onGoToPage(1)}
            aria-label="First page"
          >
            First
          </button>
          <button
            type="button"
            className={navBtnBase}
            disabled={current <= 1}
            onClick={() => onGoToPage(current - 1)}
            aria-label="Previous page"
          >
            Previous
          </button>
        </div>

        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-[0.3rem] p-0">
          {items.map((item, idx) =>
            item === 'ellipsis' ? (
              <li
                key={`e-${idx}`}
                className="select-none px-0.5 text-[0.95rem] text-[var(--text)]"
                aria-hidden
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  className={
                    pageBtnBase +
                    (item === current
                      ? ' border-[var(--accent-border)] bg-[var(--accent-bg)] font-semibold'
                      : '')
                  }
                  aria-label={`Page ${item}`}
                  aria-current={item === current ? 'page' : undefined}
                  disabled={item === current}
                  onClick={() => onGoToPage(item)}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>

        <div className="flex flex-wrap items-center gap-[0.35rem]">
          <button
            type="button"
            className={navBtnBase}
            disabled={!has_next_page}
            onClick={() => onGoToPage(current + 1)}
            aria-label="Next page"
          >
            Next
          </button>
          <button
            type="button"
            className={navBtnBase}
            disabled={current >= last}
            onClick={() => onGoToPage(last)}
            aria-label="Last page"
          >
            Last
          </button>

          <form
            className="flex flex-wrap items-center gap-1.5 border-l border-[color-mix(in_srgb,var(--border)_70%,transparent)] ps-3 max-sm:w-full max-sm:justify-center max-sm:border-l-0 max-sm:border-t max-sm:pt-2 max-sm:ps-0"
            onSubmit={submitJump}
            aria-label="Go to page"
          >
            <label
              htmlFor="pagination-jump-page"
              className="whitespace-nowrap text-[0.85rem] text-[var(--text)]"
            >
              Page
            </label>
            <input
              id="pagination-jump-page"
              type="number"
              name="page"
              min={1}
              max={last}
              inputMode="numeric"
              className={jumpInputClass}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              aria-describedby="pagination-jump-hint"
            />
            <button type="submit" className={navBtnBase}>
              Go
            </button>
            <span id="pagination-jump-hint" className="sr-only">
              Enter a page number between 1 and {last}, then press Go.
            </span>
          </form>
        </div>
      </div>

      <p className="m-0 text-[0.95rem] text-[var(--text)]">
        Page {current} of {last}
      </p>
    </nav>
  )
}
