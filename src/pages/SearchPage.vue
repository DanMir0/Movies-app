<script setup>
import MoviesList from "@/components/MoviesList.vue";
import {computed, ref, watch} from "vue";
import MyNavbar from "@/components/UI/MyNavbar.vue";
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute()

const searchedMovies = ref([])
const searchQuery = ref(route.query.q || '')

const page = ref(1)
const totalPages = ref(1)

const fetchingSearch = async () => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
        'query': searchQuery.value,
        'page': page.value
      }
    })
    searchedMovies.value = response.data.results
    totalPages.value = response.data.total_pages
  } catch (e) {
    console.log('search', e)
  }
}

const displayedPages = computed(() => {
  const result = [];
  const displayPage = 5;
  const startPage = 1;
  const endPage = totalPages.value

  if (page.value < displayPage - 1) {
    for (let i = startPage; i <= displayPage; i++) {
      result.push(i);
    }
    if (endPage > displayPage) {
      result.push('...');
      result.push(endPage);
    }
  } else if (page.value > displayPage - 2) {
    if (startPage < page.value - 2) {
      result.push(startPage);
      result.push('...');
    }
    for (let i = Math.max(startPage, page.value - 2); i <= Math.min(page.value + 2, endPage); i++) {
      result.push(i);
    }
    if (endPage > page.value + 2 && page.value !== endPage - 2) {
      result.push('...');
      result.push(endPage);
    }
  }

  return result;
});

function changePage(pageNumber) {
  if (!isNaN(pageNumber)) {
    return page.value = pageNumber
  }
}
function prevPage() {
  return page.value -= 1
}
function nextPage() {
  return page.value += 1
}

watch(searchQuery, () => {
  page.value = 1
  fetchingSearch()
})

watch(page, () => {
  fetchingSearch()
})
</script>

<template>
  <h3>SEARCH PAGE</h3>
  <my-navbar v-model:search-query="searchQuery"></my-navbar>
  <movies-list :movies="searchedMovies"></movies-list>
  <div v-if="searchedMovies.length > 0" class="pagination">
    <ul class="page__wrapper">
      <li v-if="page !== 1" @click="prevPage"><span>Prev</span></li>
      <li
          v-for="pageNumber in displayedPages"
          :key="pageNumber"
          class="page"
          :class="{'current-page': page === pageNumber}"
          @click="changePage(pageNumber)"
      >
        {{pageNumber}}
      </li>
      <li v-if="page !== totalPages" @click="nextPage"><span>Next</span></li>
    </ul>
  </div>
</template>

<style scoped>
.page__wrapper {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page {
  border: 1px solid black;
  padding: 10px;
}
.current-page {
  border: 2px solid teal;
}
</style>