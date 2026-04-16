import type { JikanPagination } from '../types/anime.ts'

type PageItem = number | 'ellipsis'

function buildPageItems(current: number, last: number): PageItem[] {
  if (last <= 1) {
    return [1]
  }
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  const set = new Set<number>()
  set.add(1)
  set.add(last)
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= last) {
      set.add(p)
    }
  }
  const sorted = [...set].sort((a, b) => a - b)
  const out: PageItem[] = []
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!
    if (i > 0 && n - sorted[i - 1]! > 1) {
      out.push('ellipsis')
    }
    out.push(n)
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

export default function PaginationNav({
  pagination,
  onGoToPage,
}: PaginationNavProps) {
  const { current_page: current, last_visible_page: last, has_next_page } =
    pagination
  const items = buildPageItems(current, last)

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
        </div>
      </div>

      <p className="m-0 text-[0.95rem] text-[var(--text)]">
        Page {current} of {last}
      </p>
    </nav>
  )
}
