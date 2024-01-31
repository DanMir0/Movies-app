<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

let movie = ref([])
const route = useRoute()
const movieLink = ref()

const fetching = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${route.params.movie_id}`, {
        params: {
            api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
        }
    })
    movie.value = response.data
}
const linkToMovie = async () => {
    const response = await axios.get(`https://www.imdb.com/title/${movie.value.imdb_id}/`);
    movieLink.value = { imdbLink: response.config.url };
}
function getMoviePosterUrl(posterPath) {
    if (!posterPath) return

    return `https://image.tmdb.org/t/p/w200${posterPath}`
}

onMounted(() => {
    fetching();
})
</script>

<template>
    <div class="container">
        <div class=movie>
            <div>
                <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title">
                <div class="movie__grades">
                    <div>
                        <p>{{parseFloat(movie.vote_average).toFixed(1)}}</p>
                        <p>{{movie.vote_count}}</p>
                    </div>
                    <div>
                        <p>{{parseFloat(movie.popularity).toFixed(1)}}</p>
                    </div>
                </div>
            </div>
            <div class="movie__description">
                <h2>{{ movie.title }}</h2>
                <div class="movie__items">
                    <div class="movie__items-name">
                        <p class="mb-10">Name:</p>
                        <p class="mb-10">Country:</p>
                        <p class="mb-10">Genre:</p>
                        <p class="mb-10">Budget:</p>
                        <p class="mb-10">Revenue:</p>
                        <p class="mb-10">Official website:</p>
                    </div>
                    <div class="movie__items-value">
                        <p class="mb-10">{{ movie.original_title }}</p>
                        <div class="group__item"><p class="mb-10" v-for="(country, index) in movie.production_countries"> {{ country.name + (index < movie.production_countries.length - 1 ? ',&nbsp;' : ' ')}}</p></div>
                        <div class="group__item"><p class="mb-10" v-for="(genre, index) in movie.genres"> {{ genre.name + (index < movie.genres.length - 1 ? ',&nbsp;' : ' ') }}</p></div>
                        <p class="mb-10">${{ movie.budget ? movie.budget.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '' }}</p>
                        <p class="mb-10">${{ movie.revenue ? movie.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '' }}</p>
                        <a class="mb-10" :href="movie.homepage">{{movie.homepage}}</a>
                    </div>
                </div>
                <p>{{movie.overview}}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
}

.movie {
    margin-top: 20px;
    display: flex;
}

.movie__description {
    margin-left: 15px;
}

.movie__items {
    margin-top: 15px;
    display: flex;
    flex-direction: row;
}

.group__item {
    display: flex;
}

.movie__items-value {
    margin-left: 20px;
}
.mb-10 {
    margin-bottom: 10px;
}
</style>