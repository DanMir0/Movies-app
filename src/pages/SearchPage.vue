<script setup>
import MoviesList from "@/components/MoviesList.vue";
import {ref, watchEffect} from "vue";
import MyNavbar from "@/components/UI/MyNavbar.vue";
import axios from "axios";

const searchQuery = ref('')
const searchedMovies = ref([])
const fetchingSearch = async () => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
        'query': searchQuery.value
      }
    })
    searchedMovies.value = response.data.results
  } catch (e) {
    console.log('search', e)
  }
}
watchEffect(() => {
  fetchingSearch()
})

</script>

<template>
  <my-navbar v-model:search-query="searchQuery"></my-navbar>
  <movies-list :movies="searchedMovies"></movies-list>
</template>

<style scoped>

</style>