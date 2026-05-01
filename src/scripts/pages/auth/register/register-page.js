import RegisterPresenter from './register-presenter';
import * as StoryAPI from '../../../data/api';
import { alert } from '../../../utils/alert';
import { setTitle } from '../../../utils/index.js';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="flex min-h-dvh items-center justify-center px-4">
        <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 class="mb-6 text-center text-3xl font-bold text-[#393E46]">Daftar</h1>
          
          <form id="register-form" class="space-y-6">

            <div>
              <label for="name-input" class="mb-2 block text-sm font-semibold text-gray-700">Nama</label>
              <input 
                type="text" 
                id="name-input" 
                class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                placeholder="Masukkan nama Anda" 
                required
              />
            </div>
            
            <div>
              <label for="email-input" class="mb-2 block text-sm font-semibold text-gray-700">Email</label>
              <input 
                type="email" 
                id="email-input" 
                class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                placeholder="Masukkan email Anda" 
                required
              />
            </div>
            
            <div>
              <label for="password-input" class="mb-2 block text-sm font-semibold text-gray-700">Password</label>
              <input 
                type="password" 
                id="password-input" 
                class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                placeholder="Masukkan password Anda" 
                required
              />
            </div>
            
            <div id="submit-button-container">
              <button 
                type="submit" 
                class="w-full rounded-md bg-cyan-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-600 cursor-pointer"
              >
                Daftar
              </button>
            </div>
          </form>
          
          <p class="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun? 
            <a href="#/login" class="font-semibold text-cyan-600 hover:text-cyan-500 hover:underline">Masuk di sini</a>
          </p>
        </div>
      </section>
    `
  }

  async afterRender() {
    setTitle('Register')
    
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
  }


  #setupForm() {
    document.getElementById('register-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      await this.#presenter.getRegistered(data);
    });
  }

  registeredSuccessfully(message) {
    alert.success('Register Berhasil', message);

    location.hash = '/login';
  }

  registeredFailed(message) {
    alert.toastError(message);
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button 
        type="submit" 
        class="flex w-full items-center justify-center rounded-md bg-cyan-600 px-4 py-2 font-semibold text-white cursor-not-allowed" 
        disabled
      >
        <svg class="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Mohon Tunggu...
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button 
        id="submit-button"
        type="submit" 
        class="w-full rounded-md bg-cyan-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-600 cursor-pointer"
      >
        Daftar
      </button>
    `;
  }
}
