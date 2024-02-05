<script setup>
import useMoviesGenres from "@/composable/useMoviesGenres";

const props = defineProps({
    movie: Object,
    required: true,
})

function getMoviePosterUrl(posterPath) {
    if (!posterPath) return

    return `https://image.tmdb.org/t/p/w200${posterPath}`
}

const {getGenresFromMovie} = useMoviesGenres()
</script>

<template>
    <router-link :to="{name: 'movie-details', params: {movie_id: movie.id}}" class="link__movie">
        <div class="movie">
            <div class="move__title">
                <img
                    :src="getMoviePosterUrl(movie.poster_path)"
                    :alt="movie.title">
            </div>
            <div class="movie__content">
                <div>
                    <h3>{{ movie.title }}</h3>
                    <p class="movie__description">
                        {{ movie.original_title }},
                        {{ movie.release_date }},
                        {{ movie.original_language }}
                    </p>
                </div>
                <div>
                    <ul class="movie__lists">
                        <li v-for="genre in getGenresFromMovie(movie.genre_ids)">
                            <input
                                class="movie_genres"
                                type="text"
                                readonly
                                :value="genre"
                            >
                        </li>
                    </ul>
                </div>
                <p>{{ movie.overview }}</p>
            </div>
            <div class="movie__appraisal">
                <p class="movie__vote-average">
                    {{ movie.vote_average !== 'undefined' ? movie.vote_average : 0 }}
                </p>
                <p class="movie__vote-count">{{ movie.vote_count }}</p>
            </div>
        </div>
    </router-link>
</template>

<style scoped>
.movie {
    padding: 15px;
    width: 100%;
    max-width: 850px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    border-radius: 16px;
    list-style: none;
    gap: 25px;
}

.movie:hover {
    opacity: 0.8;
}

.movie__content {
    padding: 10px 0;
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}

.movie__vote-average {
    font-size: 20px;
    font-weight: 600;
}

.movie__appraisal {
    display: flex;
    gap: 10px;
}

.movie_genres {
    padding: 8px;
    font-size: 14px;
    border: 1px solid #424242;
    border-radius: 10px;
    max-width: 115px;
    width: 100%;
    background-color: transparent;
}

.move__title {
    display: flex;
}

.movie__lists {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    gap: 10px;
}

.movie__description {
    margin-top: 10px;
}

.link__movie {
    text-decoration: none;
}
</style>