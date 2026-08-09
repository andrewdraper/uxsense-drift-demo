import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Injects the UXSense recorder snippet into index.html at build time.
 *
 * The project id is supplied by the deploy environment (Render / Vercel env var
 * `VITE_UXSENSE_PROJECT_ID`) rather than committed, so this public repo carries
 * no workspace identifiers. With the id unset the site builds and runs normally
 * and simply records nothing.
 */
function uxsenseRecorder(): Plugin {
  return {
    name: 'uxsense-recorder',
    transformIndexHtml(html) {
      const projectId = process.env.VITE_UXSENSE_PROJECT_ID
      if (!projectId) {
        console.warn(
          '[uxsense] VITE_UXSENSE_PROJECT_ID is not set — building without the recorder snippet. No sessions will be recorded.',
        )
        return html
      }
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              src: `https://app.uxsense.ai/api/r.js?id=${projectId}`,
              async: true,
              defer: true,
            },
            injectTo: 'head',
          },
        ],
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        // `module:` prefix is required — without it Babel resolves the name as
        // `@uxsense/babel-plugin-stamp`, which does not exist. (The package
        // README's Vite example omits it; the README is wrong.)
        plugins: [['module:@uxsense/stamp', { manifestPath: 'uxsense-manifest.json' }]],
      },
    }),
    uxsenseRecorder(),
  ],
})
