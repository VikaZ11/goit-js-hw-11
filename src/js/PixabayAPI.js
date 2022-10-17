import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['Authorization'] =
//   '30530073-6f7e0be28cb1e95f670506a37';

export class PixabayAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      key: '30530073-6f7e0be28cb1e95f670506a37',
      image_type: 'photo',
      per_page: 40,
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };

  async getPhotos() {
    const urlAxios = `?q=${this.#query}&page=${this.#page}`;

    const { data } = await axios.get(urlAxios, this.#params);
    return data;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get query() {
    return this.#query;
  }

  get page() {
    return this.#page;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
