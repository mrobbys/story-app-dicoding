import { storiesMapper } from '../../data/api-mapper.js'

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error(`showStoriesListMap Error: ${error}`);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initListAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      const res = await this.#model.getAllStoriesHome();

      if (!res.ok) {
        console.error(`initListAndMap Error: ${res}`);
        this.#view.alertError('Gagal mendapatkan daftar cerita', 'Silahkan coba beberapa saat lagi');
        return;
      }

      const rawStories = Array.isArray(res.listStory) ? res.listStory : [];
      const stories = await Promise.all(rawStories.map((story) => storiesMapper(story)));

      this.#view.showStories(stories);

    } catch (error) {
      console.error(error);
      this.#view.alertError('Error', error.message)
    } finally {
      this.#view.hideLoading();
    }
  }
}