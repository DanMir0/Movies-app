import axios from "axios";
import {onMounted, ref} from "vue";

export default function useMoviesPopular() {
    const moviesPopular = ref([])

    const fetching = async () => {
        try {
            const response = await axios.get('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', {
                params: {
                    api_key: '42b000d5a4c2a76ed3400dcd6cd491e0'
                },
            });
            moviesPopular.value = response.data.results
        } catch(e) {
            console.log(e)
        }
    }

    onMounted(fetching)

    return {
        moviesPopular
    }
}