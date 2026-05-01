export default class BookmarksPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initListBookmarks() {
    this.#view.showLoading();
    try {
      const res = await this.#model.getAllStories();
      this.#view.showBookmarks(res);
    } catch (error) {
      console.error('initListBookmarks:', error);
      this.#view.alertError('Gagal memuat daftar cerita', 'Silahkan coba lagi');
    } finally {
      this.#view.hideLoading();
    }
  }
}
