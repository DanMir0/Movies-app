import axios from "axios";
import {ref, watch} from 'vue'
export default function useSearchedMovies() {
    const searchQuery = ref('')
    const searchResults = ref([])

    const searchMovies = async () => {
        try {
            searchResults.value = [];
            const queryAsNumber = parseFloat(searchQuery.value)

            if (!isNaN(queryAsNumber) && queryAsNumber >= 0 && queryAsNumber <= 10) {
                const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                    params: {
                        api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
                        'vote_average.gte': searchQuery.value,
                        'vote_average.lte': 10,
                        'sort_by': 'vote_average.asc'
                    }
                })
                searchResults.value = response.data.results;
            } else if (!isNaN(queryAsNumber) & queryAsNumber > 0) {
                const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                    params: {
                        api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
                        'primary_release_year': searchQuery.value,
                        'sort_by': 'popularity.desc'
                    }
                })
                searchResults.value = response.data.results;
            }
            else {
                const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
                        params: {
                            api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
                            query: searchQuery.value
                        }
                })
                searchResults.value = response.data.results
            }
        } catch (e) {
            console.log('Ошибка при поиске', e)
        }
    }
    const searchByGenres = async (genreIds) => {
        try {
            searchResults.value = []
            const genreNew = genreIds.value
            if (genreNew.length > 0) {
                const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                    params: {
                        api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
                        with_genres: genreNew.join(','),
                        'sort_by': 'popularity.desc',
                        'page': 1
                    }
                })
                searchResults.value = response.data.results
            }
        } catch (e) {
            console.log('search genres', e)
        }
    }
    watch(searchQuery, () => {
        searchMovies()
    });
    return {
        searchQuery,
        searchResults,
        searchMovies,
        searchByGenres
    }
}