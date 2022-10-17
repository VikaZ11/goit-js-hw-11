export function createMarkup(photos) {
  return photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return /*html*/ `<div class="photo-card"> 
       <a class="gallery__item link" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" height="250" />
        <div class="info">
          <p class="info-item">
            <b>Likes: </b>${likes}
          </p>
          <p class="info-item">
            <b>Views: </b>${views}
          </p>
          <p class="info-item">
            <b>Comments: </b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads: </b>${downloads}
          </p>
        </div>
        </a>
      </div>`;
      }
    )
    .join('');
}
