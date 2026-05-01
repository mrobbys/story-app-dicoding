import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BASE_URL } from './config';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => {
    return request.mode === 'navigate';
  },
  createHandlerBoundToURL(new URL('index.html', self.registration.scope).pathname),
);

registerRoute(
  ({ url }) => {
    return (
      url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com'
    );
  },
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
  }),
);

registerRoute(
  ({ url }) => {
    return url.origin.includes('maptiler');
  },
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);

self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  const data = event.data.json();
  if (!data) {
    console.error('Tidak ada data yang diterima');
    return;
  }

  const title = data.title || 'Story App Notification';
  const options = {
    body: data.options?.body || 'Ada info terbaru untuk Anda!',
    icon: './favicon.png',
    badge: './favicon.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
