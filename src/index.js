import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PixabayAPI } from './js/PixabayAPI';
import { createMarkup } from './js/createMarkup';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new PixabayAPI();

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      pixabay.incrementPage();
      observer.unobserve(entry.target);


      try {
        const { hits } = await pixabay.getPhotos();
        const markup = createMarkup(hits);

        refs.list.insertAdjacentHTML('beforeend', markup);
        lightbox.destroy();
        const lightbox = new SimpleLightbox('.gallery__item');
        lightbox.refresh();

        if (pixabay.isShowLoadMore) {
          const target = document.querySelector('.photo-card:last-child');
          observer.observe(target);
        }
      } catch (error) {
        Notify.failure(error.message);
        clearPage();
      }
    }
  });
};
const io = new IntersectionObserver(callback, options);

const handleSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    Notify.failure('Enter data to search!');
    return;
  }

  pixabay.query = query;
  clearPage();
  try {
    const { hits, total } = await pixabay.getPhotos();

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = createMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);

    pixabay.calculateTotalPages(total);
    Notify.success(`Hooray! We found ${total} images.'.`);

    if (pixabay.isShowLoadMore) {
      // refs.loadMoreBtn.classList.remove('is-hidden');
      const target = document.querySelector('.photo-card:last-child');
      io.observe(target);
    }
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }

  const lightbox = new SimpleLightbox('.gallery__item');
};

// const onLoadMoreClick = async function(){
//   pixabay.incrementPage();

//   if (!pixabay.isShowLoadMore) {
//     refs.loadMoreBtn.classList.add('is-hidden');
//   }

//   try {
//     const { hits } = await pixabay.getPhotos();

//     const markup = createMarkup(hits);
//     refs.list.insertAdjacentHTML('beforeend', markup);
//   } catch (error) {
//     Notify.failure(error.message);
//     clearPage();
//   }
// };

refs.form.addEventListener('submit', handleSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

function clearPage() {
  pixabay.resetPage();
  refs.list.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
