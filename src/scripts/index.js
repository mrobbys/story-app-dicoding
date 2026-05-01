// CSS imports
import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';
import 'remixicon/fonts/remixicon.css';

import App from './pages/app';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();
  
  await registerServiceWorker();
  console.log('service worker berhasil terdaftar...');

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
