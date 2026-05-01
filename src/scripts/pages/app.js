import { routes } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { getAccessToken, getLogout } from '../utils/auth';
import {
  generateAuthenticatedNavigationListTemplate,
  generateSubscribeButton,
  generateUnsubscribeButton,
} from '../templates';
import { transitionHelper, isServiceWorkerAvailable } from '../utils';
import { alert } from '../utils/alert';
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from '../utils/notification-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#init();
  }

  #init() {
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navList = this.#navigationDrawer.children.namedItem('nav-list');
    const headerNav = document.getElementById('header-nav');

    if (!isLogin) {
      headerNav.classList.add('hidden');
      navList.innerHTML = '';
      return;
    }

    headerNav.classList.remove('hidden');
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const result = await alert.confirm('Apakah Anda yakin ingin keluar?');
        if (result.isConfirmed) {
          getLogout();
          alert.toastSuccess('Berhasil logout');
          // Redirect
          location.hash = '/login';
        }
      });
    }
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButton();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });

      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButton();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    if (!route) {
      alert.error('Halaman tidak ditemukan');
      location.hash = '/';
      return;
    }

    const page = route();
    if (!page) return;

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        page.afterRender();
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });
  }
}

export default App;
