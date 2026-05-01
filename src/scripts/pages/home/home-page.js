import { setTitle } from '../../utils/index.js';
import HomePresenter from './home-presenter.js';
import * as StoryAPI from '../../data/api.js';
import Map from '../../utils/map';
import { alert } from '../../utils/alert';
import {
  generateLoader,
  generateLoaderMap,
  generateStoriesItemTemplate,
  renderEmptyElement,
  popupContentMap,
} from '../../templates.js';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="relative h-150 w-full bg-gray-500 z-40">
        <div id="map" class="relative h-150 w-full bg-gray-500"></div>
        <div id="map-loading-container"></div>
      </section>

      <section class="w-full max-w-5xl mx-auto py-12">
        <h1 class="text-center font-bold text-4xl py-8">Daftar Cerita</h1>

        <div id="stories-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        <div id="stories-list-loading-container"></div>
      </section>
    `;
  }

  async afterRender() {
    setTitle('Home');

    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.initListAndMap();
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 5,
      locate: true,
    });
  }

  showStories(stories) {
    const storiesListContainer = document.getElementById('stories-list');

    if (stories.length <= 0) {
      return (storiesListContainer.innerHTML = renderEmptyElement());
    }

    // render marker map leaflet
    if (!this.#map) return;
    stories.forEach((story) => {
      const lat = Number.parseFloat(story?.lat);
      const lon = Number.parseFloat(story?.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

      const coordinate = [lat, lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: this.popupContent(story) };

      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    });

    // render data cerita
    storiesListContainer.innerHTML = stories
      .map((story) => generateStoriesItemTemplate(story))
      .join('');
  }

  popupContent(story) {
    return popupContentMap(story);
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
    document.getElementById('stories-list-loading-container').innerHTML = generateLoader();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}
