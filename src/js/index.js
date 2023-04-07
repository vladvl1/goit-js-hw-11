import Notiflix from "notiflix";
import { PixabayAPI } from "./fetchImages";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryLightBox = new SimpleLightbox(`.gallery a`);
const pixabayAPI = new PixabayAPI();

const perPage = pixabayAPI.perPage;

const formEl = document.querySelector(`#search-form`);
const galleryEl = document.querySelector(`.gallery`);
const loadMoreEl = document.querySelector(`.load-more`);
const divSearchEl = document.querySelector(`.search`);

formEl.addEventListener(`submit`, handleSearchPhotos);
loadMoreEl.addEventListener(`click`, handleLoadMoreEls);

async function handleSearchPhotos(e) {
    e.preventDefault();

    pixabayAPI.q = e.target.elements.searchQuery.value.trim();

    if (!pixabayAPI.q) {
        Notiflix.Notify.warning(`Input is empty. Please enter something!`);
        return
    }
    
    divSearchEl.classList.add(`search-fixed`)
    pixabayAPI.page = 1;

    try {
        const { data } = await pixabayAPI.fetchImages();         
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (!data.hits.length) {
            galleryEl.innerHTML = '';
            throw new Error()

        } else if (totalPage === pixabayAPI.page) {
            Notiflix.Notify.success(`We found ${data.totalHits} images`)
            galleryEl.innerHTML = renderingGallery(data.hits);
            galleryLightBox.refresh();
            loadMoreEl.classList.add("is-hiden");
            return
        }
    
        Notiflix.Notify.success(`We found ${data.totalHits} images`)
        galleryEl.innerHTML = renderingGallery(data.hits);
        loadMoreEl.classList.remove("is-hiden")
        galleryLightBox.refresh();
    }

        catch (error) {
        loadMoreEl.classList.add("is-hiden");
        Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again`);
    };
}

async function handleLoadMoreEls(e) {

    pixabayAPI.page += 1;

    try {
        const { data } = await pixabayAPI.fetchImages();
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (totalPage === pixabayAPI.page) {
            galleryEl.insertAdjacentHTML(`beforeend`, renderingGallery(data.hits));
            loadMoreEl.classList.add("is-hiden");
            throw new Error();
        }
        
        galleryEl.insertAdjacentHTML(`beforeend`, renderingGallery(data.hits));
        galleryLightBox.refresh();

        const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
});
        
    } catch (error) {
        Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results`);
    }
}

function renderingGallery(img) {
    return img.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL, }) => `
    <a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
            <img src="${webformatURL}" "alt="${tags}" loading="lazy" class="gallery__image"/>
        
        <div class="info">
            <p class="info-item">
                <b class="info-item__statistic"><b>Likes:</b>        ${likes}</b>
            </p>
            <p class="info-item">
                <b class="info-item__statistic"><b>Views:</b>        ${views}</b>
            </p>
            <p class="info-item">
                <b class="info-item__statistic"><b>Comments:</b>        ${comments}</b>
            </p>
            <p class="info-item">
                <b class="info-item__statistic"><b>Downloads:</b>        ${downloads}</b>
            </p>
        </div>
        </div>
    </a>`).join('');
}





// const searchFormEl = document.querySelector('.js-search-form');
// const galleryListEl = document.querySelector('.js-gallery');

// const loadMoreBtnEl = document.querySelector('.js-load-more');


// const handleSearchPhotos = event => {
//   event.preventDefault();

//   const searchQuery = event.target.elements['searchQuery'].value.trim();

//   api.q = searchQuery;

//   api.fetchImages().then(data => {
//       if (!data.hits.length) {
//           loadMoreBtnEl.classList.add("is-hidden");
//           galleryListEl.innerHTML = '';
//         throw new Error();
//       }
//       if (data.totalHits === api.page) {
//             Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
//         return;
//       }

//       Notiflix.Notify.success(`We found ${data.totalHits} images`);
//       galleryListEl.innerHTML = createGalleryCards(data.hits);
//       loadMoreBtnEl.classList.remove('is-hidden');
//     })
//     .catch((error) => {
//         loadMoreBtnEl.classList.add('is-hidden');
//         Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//         console.log(console.log(error));
//     });
// };


// const handleLoadMoreBtnClick = () => {
//     api.page += 1;
//     api.fetchImages().then(data => {
//         const totalPage = Math.ceil(data.totalHits / perPage);
//         if (totalPage === api.page) {
//             galleryListEl.insertAdjacentElement("beforeend", renderGallery(data.hits));
//             loadMoreBtnEl.classList.add("is-hidden");
//             throw new Error();
//         }

//         galleryListEl.insertAdjacentElement("beforeend", renderGallery(data.hits));
//     }).catch(() => {
//         Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
//     })
// }

// searchFormEl.addEventListener('submit', handleSearchPhotos);

// loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
