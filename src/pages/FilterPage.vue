<script setup>
import axios from "axios";
import {computed, onMounted, ref, watch} from "vue";
import MoviesList from "@/components/MoviesList.vue";
import useUser from "@/composable/useUser";
import {useRoute} from "vue-router";

const moviesOrigin = ref([])
const {user} = useUser()
const route = useRoute()
const isLoading = ref(true)

const totalPages = ref(1)

const filterMovies = async () => {
    let genres = []
    if (Array.isArray(route.query.genres)) {
        genres = route.query.genres;
    } else {
        genres = [route.query.genres];
    }
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
            api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
            'primary_release_year': route.query.year || 2024,
            'vote_average.gte': route.query.startRating || 0,
            'vote_average.lte': route.query.endRating || 10,
            'with_genres':  genres.join(',') || '',
            'sort_by': route.query.sort || 'popularity.desc',
            'page': route.query.page || 1
        }
    })
    moviesOrigin.value = response.data.results

    totalPages.value = response.data.total_pages
    isLoading.value = false
}

const movies = computed(() => {
    return moviesOrigin.value.map(movie => {
        if (user.value.uid && user.value.favorites) {
            movie.isFavorite = !!user.value.favorites.includes(movie.id);
        } else {
            movie.isFavorite = false
        }
        return movie
    })
})

onMounted(() => {
    filterMovies()
})

watch(() => route.query.page, () => {
    filterMovies()
})

watch(() => route.query.sort, () => {
    filterMovies()
})

watch(() => route.query.year, () => {
    filterMovies()
})

watch(() => route.query.genres, () => {
    filterMovies()
})

watch(() => route.query.startRating, () => {
    filterMovies()
})

watch(() => route.query.endRating, () => {
    filterMovies()
})
</script>

<template>
    <ma-loader :is-loading="isLoading"></ma-loader>
    <main class="filter-page">
        <section class="menu">
         <ma-dropdown></ma-dropdown>
        </section>
        <section>
            <movies-list :movies="movies"></movies-list>
        </section>
        <ma-pagination :page="Number(route.query.page) || 1" :total-pages="totalPages">
        </ma-pagination>
    </main>
</template>

<style scoped>
.menu {
    max-width: 1130px;
    margin: 0 20px;
}

@media screen and (max-width: 1024px) {
    .menu {
        max-width: 793px;
    }
}

@media screen and (max-width: 375px) {
    .menu {
        margin: 0 10px;
    }
}
</style>