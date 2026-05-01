import { setTitle } from '../../utils/index.js';
import NewPresenter from './new-presenter';
import * as StoryAPI from '../../data/api';
import Map from '../../utils/map';
import { alert } from '../../utils/alert';
import { generateLoader, generateLoaderMap } from '../../templates.js';

export default class NewPage {
  #presenter;
  #form;
  #map = null;

  async render() {
    return `
    <section class="relative overflow-hidden">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="rounded-3xl border border-stone-200/70 bg-white/80 p-6 sm:p-8 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)]">
      <header class="space-y-3">
        <h1 class="text-3xl sm:text-4xl font-semibold text-(--ink)">
          Buat Cerita
        </h1>
        <p class="text-sm sm:text-base leading-relaxed text-stone-600">
          Bagikan cerita anda dengan deskripsi singkat dan foto terbaik. Tambahkan lokasi agar cerita
          lebih mudah ditemukan.
        </p>
      </header>

      <form id="form" class="mt-8 space-y-6" enctype="multipart/form-data">
        <div>
          <label for="description" class="block text-sm font-semibold text-stone-700">Deskripsi</label>
          <textarea id="description" name="description" rows="5"
            class="mt-2 w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-800 shadow-sm outline-none ring-0 focus:border-amber-300 focus:ring-2 focus:ring-amber-200"
            placeholder="Tulis cerita kamu di sini..." required></textarea>
        </div>

        <div>
          <label for="photo" class="block text-sm font-semibold text-stone-700">Foto</label>
          <input id="photo" name="photo" type="file" accept="image/*"
            class="mt-2 w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-700 file:mr-4 file:rounded-full file:border-0 file:bg-(--accent) file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone-900 hover:file:bg-amber-500 cursor-pointer"
            required />
        </div>

        <div class="w-full relative">
          <div class="flex items-center justify-between">
            <label for="map" class="text-sm font-semibold text-stone-700">Lokasi</label>
            <span class="text-xs text-amber-700/80">Klik peta untuk isi koordinat</span>
          </div>
          <div id="map"
            class="mt-3 w-full aspect-video sm:aspect-5/3 rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden"></div>
          <div id="map-loading-container"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="lat" class="block text-sm font-semibold text-stone-700">Latitude</label>
            <input id="lat" name="lat" type="text" readonly
              class="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-700 pointer-events-none" />
          </div>
          <div>
            <label for="lon" class="block text-sm font-semibold text-stone-700">Longitude</label>
            <input id="lon" name="lon" type="text" readonly
              class="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-stone-700 pointer-events-none" />
          </div>
        </div>

        <button type="submit"
          id="submit-button"
          class="w-full rounded-2xl bg-(--accent) px-5 py-3 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-500 cursor-pointer">
          Kirim Cerita
        </button>
      </form>
    </div>
  </div>
</section>
    `;
  }

  async afterRender() {
    setTitle('Buat Cerita');

    this.#presenter = new NewPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
    this.#presenter.showNewFormMap();
  }

  #setupForm() {
    this.#form = document.getElementById('form');
    this.#form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        description: this.#form.querySelector('#description').value,
        photo: this.#form.querySelector('#photo').files[0],
        lat: this.#form.querySelector('#lat').value,
        lon: this.#form.querySelector('#lon').value,
      };

      await this.#presenter.postNewStory(data);
    });
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 5,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();

    this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: 'true' },
    );

    draggableMarker.addEventListener('move', (e) => {
      const coordinate = e.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener('click', (e) => {
      draggableMarker.setLatLng(e.latlng);
      e.sourceTarget.flyTo(e.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.querySelector('#lat').value = latitude;
    this.#form.querySelector('#lon').value = longitude;
  }

  storeSuccessfully(message) {
    alert.toastSuccess(message);
  }

  storeFailed(title, text) {
    alert.error(title, text);
  }

  clearForm() {
    this.#form.reset();
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderMap();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    const button = document.getElementById('submit-button');
    if (!button) return;

    button.disabled = true;
    button.textContent = 'Loading...';
    button.classList.add('opacity-50', 'cursor-not-allowed');
  }

  hideSubmitLoadingButton() {
    const button = document.getElementById('submit-button');
    if (!button) return;

    button.disabled = false;
    button.textContent = 'Kirim Cerita';
    button.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}
