/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Jikan API base URL, e.g. `https://api.jikan.moe/v4` */
  readonly VITE_JIKAN_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
