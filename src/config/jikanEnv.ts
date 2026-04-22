/**
 * Jikan API base URL (MyAnimeList public API).
 * Set `VITE_JIKAN_BASE_URL` in `.env` (see `.env.example`). That file is gitignored.
 *
 * Note: In a Vite browser build, `VITE_*` values are inlined at compile time — they are
 * not secret from someone inspecting the app. Use env vars to avoid committing URLs, swap
 * endpoints per environment, or point to your own proxy later without code changes.
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

const FALLBACK = 'https://api.jikan.moe/v4'

function devWarn(message: string): void {
  if (import.meta.env.DEV) {
    console.warn(`[jikanEnv] ${message}`)
  }
}

function resolveJikanBaseUrl(raw: string | undefined): string {
  if (raw === undefined || raw.trim() === '') {
    return FALLBACK
  }
  let parsed: URL
  try {
    parsed = new URL(raw.trim())
  } catch {
    devWarn('Invalid VITE_JIKAN_BASE_URL, using default.')
    return FALLBACK
  }
  if (parsed.protocol !== 'https:') {
    devWarn('Only https:// API URLs are allowed, using default.')
    return FALLBACK
  }
  if (parsed.username !== '' || parsed.password !== '') {
    devWarn('URLs with user info are not allowed, using default.')
    return FALLBACK
  }
  return normalizeBaseUrl(`${parsed.origin}${parsed.pathname}`)
}

const fromEnv = import.meta.env.VITE_JIKAN_BASE_URL

export const JIKAN_BASE_URL: string = resolveJikanBaseUrl(fromEnv)
