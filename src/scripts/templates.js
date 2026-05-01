import { showFormattedDate } from './utils/index.js';

export function generateLoader(message = 'Memuat...') {
  return `
  <div class="flex flex-col items-center justify-center gap-3 p-4">
    <svg class="h-10 w-10 animate-spin text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    ${message ? `<span class="text-sm font-semibold tracking-wide text-gray-700">${message}</span>` : ''}
  </div>
  `;
}

export function generateLoaderMap() {
  return `
  <div class="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-[2px]">
    <div class="rounded-xl bg-white/80 p-2 shadow-xl ring-1 ring-black/5">
      ${generateLoader('Menyiapkan Peta...')}
    </div>
  </div>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
  <li>
    <a
      href="#/"
      class="block px-2.5 py-1.5 font-semibold whitespace-nowrap text-zinc-100 transition-colors duration-300 hover:underline lg:px-0 lg:py-0 lg:hover:text-cyan-400 lg:hover:no-underline"
      >Daftar Cerita</a
    >
  </li>
  <li>
    <a
      href="#/bookmarks"
      class="block px-2.5 py-1.5 font-semibold whitespace-nowrap text-zinc-100 transition-colors duration-300 hover:underline lg:px-0 lg:py-0 lg:hover:text-cyan-400 lg:hover:no-underline"
      >Cerita Tersimpan</a
    >
  </li>
  <li id="push-notification-tools"></li>
  <li>
    <a id="new-story-button" href="#/new" class="inline-block whitespace-nowrap rounded-md bg-amber-400 px-4 py-2 font-semibold text-zinc-900 transition-colors duration-300 hover:bg-amber-500">
      Buat Cerita
    </a>
  </li>
  <li>
    <a id="logout-button" href="#/logout" class="inline-block whitespace-nowrap rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-red-700">Logout</a>
  </li>
  `;
}

export function popupContentMap({ id, photoUrl, name }) {
  return `
  <div class="text-center font-sans">
    <img src="${photoUrl}" alt="Foto ${name}" class="w-full h-24 object-cover rounded-md mb-2">
    <h3 class="font-bold text-sm mb-1">${name}</h3>
    <a href="#/stories/${id}" class="text-cyan-600 hover:text-cyan-700">Lihat Detail</a>
  </div>
  `;
}

export function renderEmptyElement(message = 'Tidak ada data') {
  return `
    <p class="col-span-full text-center text-gray-500 py-8">${message}</p>
  `;
}

export function generateStoriesItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
  placeName,
}) {
  const dateFormatted = showFormattedDate(createdAt);

  // cek apakah lat dan lon ada dan tidak null
  const isValidLocation = lat !== null && lon !== null;
  // cek apakah placeName ada
  const isValidPlaceName =
    placeName && placeName.trim() !== '' && !placeName.toLowerCase().includes('null');

  // tampilkan lokasi serta lat dan lon jika ada
  const locationText =
    isValidLocation && isValidPlaceName ? `${placeName}` : 'Lokasi tidak ditemukan';

  const locationBadge = `
    <div class="mt-auto flex items-start gap-1.5 text-xs font-medium ${isValidLocation ? 'text-cyan-600' : 'text-gray-400'}">
      <i class="${isValidLocation ? 'ri-map-pin-2-fill' : 'ri-map-pin-user-line'}"></i>
      <span class="line-clamp-1 flex-1">${locationText}</span>
    </div>
  `;

  return `
  <article data-story-id="${id}" class="group/card flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-md">
    <div class="relative h-48 w-full overflow-hidden bg-gray-100">
      <img 
        src="${photoUrl}" 
        alt="Foto cerita dari ${name}" 
        class="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        loading="lazy"
      />
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div class="mb-3 flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div class="flex items-center gap-2 overflow-hidden">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
            <i class="ri-user-5-fill text-lg"></i>
          </div>
          <h2 class="truncate text-base font-bold text-gray-900" title="${name}">${name}</h2>
        </div>
        <time class="shrink-0 text-xs text-gray-500" datetime="${createdAt}">
          <i class="ri-calendar-line mr-1"></i>${dateFormatted}
        </time>
      </div>

      <p class="line-clamp-3 text-sm leading-relaxed text-gray-600 mb-4">
        ${description}
      </p>

      ${locationBadge}
    </div>

    <a href="#/stories/${id}" class="block border-t bg-gray-50 px-5 py-3 text-center font-semibold text-cyan-600 transition-colors hover:bg-cyan-50 hover:text-cyan-700 group-hover/card:text-cyan-600 border-gray-100">
      Selengkapnya <i class="ri-arrow-right-line inline-block transition-transform duration-300 group-hover/card:translate-x-2"></i>
    </a>
  </article>
  `;
}

export function generateStoriesDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
  placeName,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');

  // cek apakah lat dan lon ada dan tidak null
  const isValidLocation = lat !== null && lon !== null;
  // cek apakah placeName ada
  const isValidPlaceName =
    placeName && placeName.trim() !== '' && !placeName.toLowerCase().includes('null');

  // tampilkan lokasi serta lat dan lon jika ada
  const locationText =
    isValidLocation && isValidPlaceName
      ? `${placeName} (${lat}, ${lon})`
      : 'Lokasi tidak ditemukan';

  // location badge
  const locationBadge = `
  <span class="flex items-center gap-1.5 ${isValidLocation ? 'text-cyan-600' : 'text-gray-400'}">
    <i class="${isValidLocation ? 'ri-map-pin-2-fill' : 'ri-map-pin-user-line'}"></i>
    ${locationText}
  </span>
  `;

  return `
  <header class="mb-8 border-b border-zinc-100 pb-6">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
          ${name}
        </h1>
        
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
          <span class="flex items-center gap-1.5">
            <i class="ri-calendar-line"></i>
            ${createdAtFormatted}
          </span>
          <span class="text-zinc-300">&bull;</span>
          ${locationBadge}
        </div>
      </header>
  
      <div id="images-container" class="w-full aspect-video sm:aspect-21/9 bg-zinc-100 rounded-2xl overflow-hidden mb-12 flex items-center justify-center text-sm font-medium text-zinc-400">
        ${generateReportDetailImageTemplate(photoUrl, `Foto cerita dari ${name}`)}
      </div>
  
      <div class="w-full space-y-8">
        <div>
          <h2 class="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">Story</h2>
          <p class="text-base sm:text-lg leading-relaxed text-zinc-700">
            ${description}
          </p>
        </div>
  
        <div class="w-full relative">
          <h2 class="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">Location Map</h2>
          <div id="map" class="w-full aspect-video sm:aspect-5/3 bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden flex items-center justify-center text-sm font-medium text-zinc-400">
          </div>
          <div id="map-loading-container"></div>
        </div>

        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold uppercase tracking-widest text-zinc-400">Aksi</h2>

           <div id="story-detail-actions" class="flex items-center gap-4">
            
           </div>
        </div>
      </div>
  `;
}

export function generateReportDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="w-full h-full object-cover" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="w-full h-full object-cover" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateSubscribeButton() {
  return `
    <button id="subscribe-button" class="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 cursor-pointer">
      <i class="ri-notification-2-line text-lg animate-bounce"></i>
      Aktifkan Notifikasi
    </button>
  `;
}

export function generateUnsubscribeButton() {
  return `
    <button id="unsubscribe-button" class="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-600 border border-zinc-200 transition-all duration-300 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 cursor-pointer">
      <i class="ri-notification-off-line text-lg"></i>
      Matikan Notifikasi
    </button>
  `;
}

export function generateSaveButton() {
  return `
    <button
      id="story-detail-save"
      class="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-colors cursor-pointer hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      type="button"
    >
      <i class="ri-bookmark-line text-lg"></i>
      Simpan Cerita
    </button>
  `;
}

export function generateRemoveSaveButton() {
  return `
    <button
      id="story-detail-remove"
      class="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-colors cursor-pointer hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      type="button"
    >
      <i class="ri-bookmark-fill text-lg"></i>
      Hapus Dari Bookmark
    </button>
  `;
}
