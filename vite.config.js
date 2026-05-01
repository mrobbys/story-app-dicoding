import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  plugins: [
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'scripts',
      filename: 'sw.js',
      injectRegister: null,
      manifest: {
        name: 'Story App',
        short_name: 'StoryApp',
        start_url: '.',
        description: 'Platform sosial untuk berbagi cerita dan pengalaman harian Anda dengan dunia secara instan.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0891b2',
        icons: [
          {
            src: 'images/icons/icon-x144.png',
            type: 'image/png',
            sizes: '144x144',
            purpose: 'any',
          },
          {
            src: 'images/icons/maskable-icon-x48.png',
            type: 'image/png',
            sizes: '48x48',
            purpose: 'maskable',
          },
          {
            src: 'images/icons/maskable-icon-x96.png',
            type: 'image/png',
            sizes: '96x96',
            purpose: 'maskable',
          },
          {
            src: 'images/icons/maskable-icon-x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: 'images/icons/maskable-icon-x384.png',
            type: 'image/png',
            sizes: '384x384',
            purpose: 'maskable',
          },
          {
            src: 'images/icons/maskable-icon-x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'images/screenshots/story-app-1.png',
            type: 'image/png',
            sizes: '1920x1080',
            form_factor: 'wide',
          },
          {
            src: 'images/screenshots/story-app-2.png',
            type: 'image/png',
            sizes: '1920x1080',
            form_factor: 'wide',
          },
          {
            src: 'images/screenshots/story-app-3.png',
            type: 'image/png',
            sizes: '1920x1080',
            form_factor: 'wide',
          },
        ],
      },
    }),
  ],
  build: {
    outDir: resolve(__dirname, 'docs'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
