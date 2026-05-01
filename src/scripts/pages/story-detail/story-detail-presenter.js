import { storiesMapper } from '../../data/api-mapper';

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #model;
  #dbModel;

  constructor(storyId, { view, model, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async showStoriesDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error(`showStoriestDetailMap: ${error.message}`);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoriesDetail() {
    this.#view.showLoading();
    try {
      const res = await this.#model.getStoriesById(this.#storyId);
      if (!res.ok) {
        console.error(`showStoriesDetail: ${res.message}`);
        this.#view.alertError('Gagal menampilkan detail cerita', 'Silahkan coba lagi nanti');
        return;
      }

      const storyDetail = await storiesMapper(res.story);

      this.#view.populateStoriesDetailAndInitialMap(storyDetail);
    } catch (error) {
      console.error(`showStoriesDetail: ${error.message}`);
      this.#view.alertError('Error', error.message);
    } finally {
      this.#view.hideLoading();
    }
  }

  async saveStory() {
    try {
      const story = await this.#model.getStoriesById(this.#storyId);
      if (!story.ok) {
        console.error(`saveStory: ${story.message}`);
        this.#view.alertError('Gagal Mengambil Cerita', 'Silahkan coba lagi nanti');
        return;
      }

      await this.#dbModel.addStory(story.story);
      this.#view.toastSuccess('Cerita berhasil disimpan');
    } catch (error) {
      console.error(`saveStory: ${error.message}`);
      this.#view.toastError('Gagal menyimpan cerita');
    }
  }

  async removeStory() {
    try {
      await this.#dbModel.removeStory(this.#storyId);
      this.#view.toastSuccess('Cerita berhasil dihapus');
    } catch (error) {
      console.error(`removeStory: ${error.message}`);
      this.#view.toastError('Gagal menghapus cerita');
    }
  }

  async showSaveButton() {
    if (await this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  async #isStorySaved() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
