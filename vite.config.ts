import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// SMED Up — PWA (offline-capable, local-first, no backend).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'branding/leonardo.jpg', 'branding/logo-sodexo.png', 'branding/logo-vale.png'],
      manifest: {
        name: 'SMED Up',
        short_name: 'SMED Up',
        description: 'Coleta de campo e análise da metodologia SMED — 100% local no dispositivo.',
        lang: 'pt-BR',
        theme_color: '#007E7A',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
});
