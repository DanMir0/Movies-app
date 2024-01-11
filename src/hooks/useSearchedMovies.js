import {computed, onMounted, ref} from "vue";
import useGenresList from "@/hooks/useGenresList";

export default function useSearchedMovies(movies) {
    const searchQuery = ref('')
    const { genresList, getGenresFromMovie } = useGenresList()

    onMounted(() => {
        genresList.value
    })

    const searchedMovies = computed(() => {
        return movies.value.filter(movie => {
            const titleMatch = movie.title
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase());
            const yearMatch =
                movie.release_date.split("-")[0].includes(searchQuery.value);
            const genresMatch = getGenresFromMovie(movie.genre_ids)
                .some(genre => genre.toLowerCase().includes(searchQuery.value.toLowerCase()))
            const ratingMatch = movie.vote_average.toString().includes(searchQuery.value)
            return titleMatch || yearMatch || genresMatch || ratingMatch;
        });
    });

    return {
        searchQuery, searchedMovies
    }
}