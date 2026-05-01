import { isCurrentPushSubscriptionAvailable } from '../../utils/notification-helper';

export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error(`showNewFormMap: ${error.message}`);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, photo, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const res = await this.#model.storeNewReport({ description, photo, lat, lon });

      if (!res.ok) {
        console.error(`postNewStory: ${res.message}`);
        this.#view.storeFailed('Gagal menyimpan cerita', res.message);
        return;
      }

      const isSubscribed = await isCurrentPushSubscriptionAvailable();
      if (!isSubscribed) this.#view.storeSuccessfully('Cerita berhasil disimpan.');

      location.hash = '/';
    } catch (error) {
      console.error(`postNewStory: ${error.message}`);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
