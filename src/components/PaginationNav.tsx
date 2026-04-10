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

export default function PaginationNav({
  pagination,
  onGoToPage,
}: PaginationNavProps) {
  const { current_page: current, last_visible_page: last, has_next_page } =
    pagination
  const items = buildPageItems(current, last)

  return (
    <nav className="pagination" aria-label="Page navigation">
      <div className="pagination__bar">
        <div className="pagination__controls">
          <button
            type="button"
            className="pagination__btn"
            disabled={current <= 1}
            onClick={() => onGoToPage(1)}
            aria-label="First page"
          >
            First
          </button>
          <button
            type="button"
            className="pagination__btn"
            disabled={current <= 1}
            onClick={() => onGoToPage(current - 1)}
            aria-label="Previous page"
          >
            Previous
          </button>
        </div>

        <ul className="pagination__pages">
          {items.map((item, idx) =>
            item === 'ellipsis' ? (
              <li
                key={`e-${idx}`}
                className="pagination__ellipsis"
                aria-hidden
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  className={
                    'pagination__page-btn' +
                    (item === current ? ' pagination__page-btn--current' : '')
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

        <div className="pagination__controls">
          <button
            type="button"
            className="pagination__btn"
            disabled={!has_next_page}
            onClick={() => onGoToPage(current + 1)}
            aria-label="Next page"
          >
            Next
          </button>
          <button
            type="button"
            className="pagination__btn"
            disabled={current >= last}
            onClick={() => onGoToPage(last)}
            aria-label="Last page"
          >
            Last
          </button>
        </div>
      </div>

      <p className="pagination__info">
        Page {current} of {last}
      </p>
    </nav>
  )
}
