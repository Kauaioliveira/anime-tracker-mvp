import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import type { IndexHtmlTransformContext } from 'vite'

/**
 * Production-only CSP: avoids breaking Vite HMR / websocket in dev.
 * Align with Google Fonts + Emotion/MUI + Jikan (https fetch + image CDNs).
 */
function securityContentPolicy(): string {
  return [
    "default-src 'self'",
    "script-src 'self'",
    // Emotion / MUI + Tailwind runtime; Google Fonts stylesheet link
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https:",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ')
}

function htmlSecurityMetaPlugin(): Plugin {
  return {
    name: 'html-security-csp',
    transformIndexHtml: {
      order: 'post',
      handler(html: string, ctx: IndexHtmlTransformContext) {
        if (ctx.server) {
          return html
        }
        const csp = securityContentPolicy()
        const injection = `    <meta http-equiv="Content-Security-Policy" content="${csp}" />\n`
        return html.replace('<head>', `<head>\n${injection}`)
      },
    },
  }
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
} as const

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), htmlSecurityMetaPlugin()],
  server: {
    headers: { ...securityHeaders },
  },
  preview: {
    headers: { ...securityHeaders },
  },
})
