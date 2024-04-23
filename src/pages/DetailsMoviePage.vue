<script setup>
import axios from "axios";
import {computed, ref, watchEffect} from "vue";
import MaGrades from "@/components/UI/MaGrades.vue";
import MaComments from "@/components/MaComments.vue";

let props = defineProps({
    movie_id: {
        required: true
    }
})

let movie = ref([])

const fetchingMovie = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${props.movie_id}`, {
        params: {
            api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
        }
    })
    movie.value = response.data
}

const movieId = computed(() => {
    return props.movie_id
})


const movieVoteAverage = computed(() => {
    return movie.value.vote_average ? movie.value.vote_average.toFixed(1) : 0
})

const moviePopularity = computed(() => {
    return movie.value.popularity ? parseFloat(movie.value.vote_average) : 0
})

function getMoviePosterUrl(posterPath) {
    if (!posterPath) return
    return `https://image.tmdb.org/t/p/w200${posterPath}`
}

const extractAndJoinNames = (arr) => {
    let joinNames = []
    for (let key in arr) {
        joinNames.push(arr[key].name)
    }
    return joinNames.join(', ')
}

const convertCash = (many) => {
    return many ? '$ ' + many.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }) : 'Unfortunately, we don\'t know yet.'
}

watchEffect(async () => {
    await fetchingMovie()
})

</script>

<template>
    <div class="movie">
        <section class="poster">
            <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title">
            <div class="poster__group">
                <div class="poster__info">
                    <span class="movie__icon movie__icon-imdb"></span>
                    <b>{{ movieVoteAverage }}</b>
                </div>
                <div class="poster__info">
                    <span class="movie__icon movie__icon-like"></span>
                    <b>{{ movie.vote_count }}</b>
                </div>
                <div class="poster__info">
                    <span class="movie__icon movie__icon-eye"></span>
                    <b>{{ moviePopularity }}</b>
                </div>
            </div>
            <MaGrades :rating="parseFloat(movieVoteAverage)"/>
        </section>
        <section class="movie__info-items">
            <h3>{{ movie.title }}</h3>
            <div class="block__items">
                <dl class="movie__info-item">
                    <dt class="movie__info-item-name">Name:</dt>
                    <dd>{{ movie.original_title }}</dd>
                </dl>
                <dl class="movie__info-item">
                    <dt class="movie__info-item-name">Country:</dt>
                    <dd>{{ extractAndJoinNames(movie.production_countries) }}</dd>
                </dl>
                <dl class="movie__info-item">
                    <dt class="movie__info-item-name">Genre:</dt>
                    <dd>{{ extractAndJoinNames(movie.genres) }}</dd>
                </dl>
                <dl class="movie__info-item">
                    <dt class="movie__info-item-name">Budget:</dt>
                    <dd> {{ convertCash(movie.budget) }}</dd>
                </dl>
                <dl class="movie__info-item">
                    <dt class="movie__info-item-name">Revenue:</dt>
                    <dd> {{ convertCash(movie.revenue) }}</dd>
                </dl>
                <dl class="movie__info-item">
                    <dt class="movie__info-item-name">Official website:</dt>
                    <dd>
                        <a v-if="movie.homepage" :href="movie.homepage">{{ movie.homepage }}</a>
                        <span v-else>Sorry, we don\'t know yet.</span>
                    </dd>
                </dl>
                <dl class="movie__info-item">
                    <dt class="movie__info-item-name">IMDB:</dt>
                    <dd><a :href="`https://www.imdb.com/title/${movie.imdb_id}`">Go to imdb</a></dd>
                </dl>
            </div>
            <p class="movie__overview">{{ movie.overview }}</p>
        </section>
    </div>
    <MaComments :movieId="movieId"/>

</template>

<style scoped>
.movie {
    padding: 0 40px;
    display: flex;
    gap: 20px;
    justify-content: center;
}

.poster {
    display: flex;
    gap: 10px;
    flex-direction: column;
}

.poster__group {
    display: flex;
    justify-content: space-between;
}

.poster__info {
    display: flex;
    align-items: center;
    gap: 5px;
}

.movie__info-items {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.block__items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.movie__info-item {
    display: flex;
}

.movie__info-item-name {
    max-width: 120px;
    width: 100%;
}

a {
    text-decoration: underline;
}

a:hover {
    color: #b8860b;
}

.movie__icon {
    background-repeat: no-repeat;
    background-size: cover;
    width: 25px;
    height: 25px;
}

.movie__icon-imdb {
    background-image: url("/src/icons/imdb.svg");
}

.movie__icon-like {
    background-image: url("/src/icons/like.svg");
}

.movie__icon-eye {
    background-image: url("/src/icons/eye.svg");
}

@media screen and (max-width: 670px) {
    .movie {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .movie__info-items {
        align-items: center;
    }
}
</style>