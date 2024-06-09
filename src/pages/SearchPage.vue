<script setup>
import MoviesList from "@/components/MoviesList.vue";
import {ref, watch} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import MaLoader from "@/components/MaLoader.vue";

const route = useRoute()
const isLoading = ref(true)
const searchedMovies = ref([])

const totalPages = ref(1)

const fetchingSearch = async () => {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
            api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
            'query': route.query.q,
            'page': route.query.page || 1
        }
    })
    searchedMovies.value = response.data.results
    totalPages.value = response.data.total_pages

    isLoading.value = false
}

watch(() => route.query.q,
    () => {
        fetchingSearch()
    }, {
    immediate: true
    })
watch(() => route.query.page, () => {
    fetchingSearch()
})
</script>

<template>
    <ma-loader :is-loading="isLoading"></ma-loader>
    <div class="search-page">
        <movies-list :movies="searchedMovies"></movies-list>
        <ma-pagination v-if="searchedMovies.length > 0" :total-pages="totalPages" :page="Number(route.query.page ) || 1"/>
    </div>
</template>

<style scoped>
.search-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>