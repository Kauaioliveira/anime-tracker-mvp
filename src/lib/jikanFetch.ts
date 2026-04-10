/**
 * Jikan public API is rate-limited. Retry briefly on HTTP 429 to reduce failures.
 */
const MAX_ATTEMPTS = 3

function retryDelayMs(attempt: number, retryAfterHeader: string | null): number {
  if (retryAfterHeader !== null && retryAfterHeader !== '') {
    const sec = Number.parseInt(retryAfterHeader, 10)
    if (Number.isFinite(sec) && sec > 0) {
      return Math.min(sec * 1000, 10000)
    }
  }
  return 1200 * (attempt + 1)
}

export async function fetchJikan(url: string): Promise<Response> {
  let last: Response | null = null
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const res = await fetch(url)
    last = res
    if (res.status !== 429) {
      return res
    }
    if (attempt >= MAX_ATTEMPTS - 1) {
      return res
    }
    await new Promise((r) =>
      setTimeout(r, retryDelayMs(attempt, res.headers.get('Retry-After'))),
    )
  }
  return last as Response
}

export function jikanErrorMessage(status: number): string {
  if (status === 429) {
    return 'Too many requests. Please wait a few seconds and try again.'
  }
  return `HTTP ${status}`
}
