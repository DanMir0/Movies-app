<script setup>
import MoviesList from "@/components/MoviesList.vue";
import {ref, watch} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute()

const searchedMovies = ref([])

const page = ref(1)
const totalPages = ref(1)

const fetchingSearch = async () => {
  const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
    params: {
      api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
      'query': route.query.q,
      'page': page.value
    }
  })
  searchedMovies.value = response.data.results
  totalPages.value = response.data.total_pages
}

function changePage(pageNumber) {
  if (!isNaN(pageNumber)) {
    return page.value = pageNumber
  }
}

watch(() => route.query.q,
    () => {
      page.value = 1
      fetchingSearch()
    })

watch(page, () => {
  fetchingSearch()
})
</script>

<template>
  <movies-list :movies="searchedMovies"></movies-list>
  <ma-pagination v-if="searchedMovies.length > 0" :total-pages="totalPages" :page="page" @change="changePage"/>
</template>