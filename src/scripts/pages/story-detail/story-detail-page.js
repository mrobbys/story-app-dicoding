import { setTitle } from '../../utils/index.js';
import StoryDetailPresenter from './story-detail-presenter';
import * as StoryAPI from '../../data/api.js';
import Map from '../../utils/map';
import { alert } from '../../utils/alert.js';
import { parseActivePathname } from '../../routes/url-parser';
import {
  generateLoader,
  generateLoaderMap,
  renderEmptyElement,
  popupContentMap,
  generateStoriesDetailTemplate,
  generateSaveButton,
  generateRemoveSaveButton,
} from '../../templates';
import Database from '../../data/database';

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="relative bg-white pb-20">
        <div id="story-detail" class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16"></div>
        <div id="story-detail-loading-container"></div>
      </section>
    `;
  }

  async afterRender() {
    setTitle('Story Detail');

    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      model: StoryAPI,
      dbModel: Database,
    });

    this.#presenter.showStoriesDetail();
  }

  async populateStoriesDetailAndInitialMap(story) {
    const storyDetailContainer = document.getElementById('story-detail');
    if (!storyDetailContainer) return;

    if (!story) {
      storyDetailContainer.innerHTML = renderEmptyElement('Cerita tidak ditemukan');
      return;
    }

    storyDetailContainer.innerHTML = generateStoriesDetailTemplate(story);

    // map
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const lat = Number.parseFloat(story?.lat);
    const lon = Number.parseFloat(story?.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      mapContainer.innerHTML = renderEmptyElement('Lokasi tidak ditemukan');
      return;
    }

    await this.#presenter.showStoriesDetailMap();
    if (!this.#map) return;

    const coordinate = [lat, lon];
    const markerOptions = { alt: story.name };
    const popupOptions = { content: this.popupContent(story) };

    this.#map.changeCamera(coordinate);
    this.#map.addMarker(coordinate, markerOptions, popupOptions);

    this.#presenter.showSaveButton();
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  renderSaveButton() {
    const storyDetailActions = document.getElementById('story-detail-actions');
    if (!storyDetailActions) return;
    storyDetailActions.innerHTML = generateSaveButton();

    const saveBtn = document.getElementById('story-detail-save');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', async () => {
      await this.#presenter.saveStory();
      await this.#presenter.showSaveButton();
    });
  }

  renderRemoveButton() {
    const storyDetailActions = document.getElementById('story-detail-actions');
    if (!storyDetailActions) return;
    storyDetailActions.innerHTML = generateRemoveSaveButton();

    const removeBtn = document.getElementById('story-detail-remove');
    if (!removeBtn) return;

    removeBtn.addEventListener('click', async () => {
      await this.#presenter.removeStory();
      await this.#presenter.showSaveButton();
    });
  }

  popupContent(story) {
    return popupContentMap(story);
  }

  toastSuccess(message){
    alert.toastSuccess(message);
  }
  
  toastError(message) {
    alert.toastError(message);
  }
  
  alertSuccess(title, text) {
    alert.success(title, text);
  }

  alertError(title, text) {
    alert.error(title, text);
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderMap();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = generateLoader();
  }

  hideLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }
}
