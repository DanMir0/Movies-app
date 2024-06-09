<script setup>
import MoviesList from "@/components/MoviesList.vue";
import useUser from "@/composable/useUser";
import {onMounted, ref} from "vue";
import axios from "axios";
import MaLoader from "@/components/MaLoader.vue";

const {getFavorites} = useUser()

let movies = ref([])
const isLoading = ref(true)

const getFavoritesMovies = async () => {
    let moviesId = await getFavorites()

    const favoritesMovies = await Promise.all(moviesId.map(async (movieId) => {
        const movie = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
                api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
            }
        })
        return movie.data
    }))

    movies.value = favoritesMovies
    isLoading.value = false
}

onMounted(async () => {
    await getFavoritesMovies()
})

</script>

<template>
    <ma-loader :is-loading="isLoading"></ma-loader>
<h2 class="title">Favorites</h2>
    <movies-list :movies="movies"></movies-list>
</template>

<style scoped>
.title {
    text-align: center;
}
</style>