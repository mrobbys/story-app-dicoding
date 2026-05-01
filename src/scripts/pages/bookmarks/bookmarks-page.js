import { setTitle } from '../../utils/index.js';
import { alert } from '../../utils/alert';
import {
  generateLoader,
  generateStoriesItemTemplate,
  renderEmptyElement,
} from '../../templates.js';
import Database from '../../data/database.js';
import BookmarksPresenter from './bookmarks-presenter.js';

export default class BookmarksPage {
  #presenter = null;

  async render() {
    return `
      <section class="w-full max-w-5xl mx-auto py-12">
        <h1 class="text-center font-bold text-4xl py-8">Daftar Cerita Tersimpan</h1>

        <div id="bookmarks" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        <div id="bookmarks-loading-container"></div>
      </section>
    `;
  }

  async afterRender() {
    setTitle('Bookmarks');

    this.#presenter = new BookmarksPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.initListBookmarks();
  }

  showBookmarks(bookmarks) {
    const bookmarksContainer = document.getElementById('bookmarks');
    if (!bookmarksContainer) {
      console.error('Element with ID "bookmarks" not found');
      return;
    }

    if (bookmarks.length === 0) {
      bookmarksContainer.innerHTML = renderEmptyElement('Tidak ada cerita tersimpan');
      return;
    }

    bookmarksContainer.innerHTML = bookmarks.map(generateStoriesItemTemplate).join('');
  }

  alertSuccess(title, text) {
    alert.success(title, text);
  }

  alertError(title, text) {
    alert.error(title, text);
  }

  showLoading() {
    document.getElementById('bookmarks-loading-container').innerHTML = generateLoader();
  }

  hideLoading() {
    document.getElementById('bookmarks-loading-container').innerHTML = '';
  }
}
