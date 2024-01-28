import axios from "axios";
import {onMounted, ref} from "vue";

export default function useMoviesGenres() {
    const genres = ref([])
    const getAllGenres = async () => {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
            params: {
                api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
            }
        })
        genres.value = response.data.genres
    }

    const getGenresFromMovie = (genreIds) => {
        return genres.value
            .filter(genre => genreIds.includes(genre.id))
            .map(genre => genre.name)
    }

    onMounted(getAllGenres)

    return {
        genres,
        getGenresFromMovie
    }
}
