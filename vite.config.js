import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Skip installable PWA manifest polish for now — just cache content
      manifest: false,
      devOptions: {
        // Enable in dev so you can test offline with DevTools → Network → Offline
        enabled: true,
      },
      workbox: {
        // Pre-cache everything the app shell needs: JS, CSS, HTML, bundled photos
        globPatterns: ['**/*.{js,css,html,jpg,png,svg,woff2,webp,ico}'],
        runtimeCaching: [
          // Google Maps requires network — don't cache, fail gracefully
          {
            urlPattern: /^https:\/\/maps\.(googleapis|gstatic)\.com\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})
