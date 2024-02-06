<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import { FaBandsImdb, MdOutlinedGrade, CaViewFilled } from "@kalimahapps/vue-icons";

let movie = ref([])
const route = useRoute()

const fetching = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${route.params.movie_id}`, {
        params: {
            api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
        }
    })
    movie.value = response.data
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
                    <div class="group__grades">
                        <FaBandsImdb class="icon__grade"></FaBandsImdb>
                        <p>{{ parseFloat(movie.vote_average).toFixed(1) }}</p>
                    </div>
                    <div class="group__grades">
                        <MdOutlinedGrade class="icon__grade"></MdOutlinedGrade>
                        <p>{{ movie.vote_count }}</p>
                    </div>
                    <div class="group__grades">
                        <CaViewFilled class="icon__grade"></CaViewFilled>
                        <p>{{ parseFloat(movie.popularity).toFixed() }}</p>
                    </div>
                </div>
            </div>
            <div class="movie__description">
                <h2>{{ movie.title }}</h2>
                <div class="movie__items">
                    <div class="movie__items-name">
                        <p>Name:</p>
                        <p>Country:</p>
                        <p>Genre:</p>
                        <p>Budget:</p>
                        <p>Revenue:</p>
                        <p>Official website:</p>
                        <p>IMDB:</p>
                    </div>
                    <div class="movie__items-value">
                        <p>{{ movie.original_title }}</p>
                        <div class="group__item"><p v-for="(country, index) in movie.production_countries">
                            {{ country.name + (index < movie.production_countries.length - 1 ? ',&nbsp;' : ' ') }}</p>
                        </div>
                        <div class="group__item"><p v-for="(genre, index) in movie.genres">
                            {{ genre.name + (index < movie.genres.length - 1 ? ',&nbsp;' : ' ') }}</p></div>
                        <p>${{
                                movie.budget ? movie.budget.toLocaleString('en-US', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }) : ''
                            }}</p>
                        <p>${{
                                movie.revenue ? movie.revenue.toLocaleString('en-US', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }) : ''
                            }}</p>
                        <a :href="movie.homepage">{{ movie.homepage }}</a>
                        <a :href="`https://www.imdb.com/title/${movie.imdb_id}`">https://www.imdb.com/title/{{ movie.imdb_id }}</a>
                    </div>
                </div>
                <p>{{ movie.overview }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    margin: 0 auto;
    width: 100%;
    max-width: 1000px;
}

.movie {
    margin-top: 20px;
    display: flex;
}

.movie__description {
    margin-left: 15px;
}

.movie__items {
    margin: 20px 0;
    display: flex;
    flex-direction: row;
}

.group__item {
    display: flex;
    flex-direction: row;
}

.movie__items-value {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.movie__items-name {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.movie__grades {
    display: flex;
    justify-content: space-around;
}

.group__grades {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.icon__grade {
    width: 3em;
    height: 1.4em;
}
</style>