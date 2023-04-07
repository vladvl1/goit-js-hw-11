import axios from "axios";

export class PixabayAPI {
    #BASE_URL = `https://pixabay.com/api/`;
    #API_KEY = `35161170-19a8cec553477928b570270a3`;

    #BASE_SEARCH_PARAMS = {
        image_type: `photo`,
        orientation: `horizontal`,
        safesearch: `true`,
        per_page: 40,
    }

    get perPage() {
        return this.#BASE_SEARCH_PARAMS.per_page;
    }

    q = null;
    page = 1;
    
    fetchImages() {
        return axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&`,{
            params: {
                q: this.q,
                ...this.#BASE_SEARCH_PARAMS,
                page: this.page,
        },
    });
    }
}
