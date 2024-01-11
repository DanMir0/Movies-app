import {onMounted, ref} from "vue";
import axios from "axios";

export default function useGenresList() {
    const genresList = ref([])

    const fetching = async () => {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
            params: {
                api_key: '42b000d5a4c2a76ed3400dcd6cd491e0'
            }
        })
        genresList.value = response.data.genres
    }
    const getGenresFromMovie = (genreIds) => {
       return genresList.value
           .filter(genre => genreIds.includes(genre.id))
           .map(genre => genre.name)
    }
    onMounted(fetching)

    return {
        genresList,
        getGenresFromMovie,
    }
}