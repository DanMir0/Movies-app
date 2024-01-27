<script setup>
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import MoviesList from "@/components/MoviesList.vue";
import useMoviesGenres from "@/composition/useMoviesGenres";

const movies = ref([])

const selectedYear = ref('')

const sortOptions = ref([
  { value: 'popularity.asc', name: 'Popularity asc'},
  { value: 'popularity.desc', name: 'Popularity desc'},
  { value: 'primary_release_date.asc', name: 'Release date asc'},
  { value: 'primary_release_date.desc', name: 'Release date desc'},
  { value: 'vote_average.asc', name: 'Vote average asc'},
  { value: 'vote_average.desc', name: 'Vote average desc'},
])
const selectedSort = ref('popularity.desc')

const selectedGenres = ref([])

const rating = ref()

const page = ref(1)
const totalPages = ref(1)

const { genres } = useMoviesGenres()
const filterMovies = async () => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: {
        api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
        'primary_release_year': selectedYear.value,
        'vote_average.gte': rating.value,
        'vote_average.lte': 10,
        'with_genres': selectedGenres.value.join(','),
        'sort_by': selectedSort.value,
        'page': page.value
      }
    })
    movies.value = response.data.results
    totalPages.value = response.data.total_pages
  }catch (e) {
    console.log('filter movies', e)
  }
}

const handleGenreChange = (genreId) => {
  if (selectedGenres.value.includes(genreId)) {
    selectedGenres.value = selectedGenres.value.filter(id => id !== genreId)
  } else {
    selectedGenres.value.push(genreId)
  }
  page.value = 1
  filterMovies()
}

function changePage(pageNumber) {
  if (pageNumber !== '...') {
    page.value = pageNumber
  }
}

onMounted(filterMovies)

watch(page, () => {
  filterMovies()
})

watch([selectedYear, rating, selectedSort], () => {
  page.value = 1
  filterMovies()
})

</script>

<template>
  <div>
    <div>
      <select v-model="selectedYear">
        <option disabled value="">Year...</option>
        <option
            v-for="year in 24"
            :key="year"
            :value="2000 + year"
        >
          {{2000 + year}}
        </option>
      </select>
      <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          v-model="rating"
      >
      <select multiple>
        <option disabled value="">Genres...</option>
        <option
            v-for="genre in genres"
            :key="genre.id"
            :value="genre.id"
            :class="{ 'selected': selectedGenres.includes(genre.id) }"
            @click="handleGenreChange(genre.id)"
        >
          {{genre.name}}
        </option>
      </select>
      <select v-model="selectedSort">
        <option disabled value="">Select from the list</option>
        <option
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
        >
          {{ option.name }}
        </option>
      </select>
    </div>
    <div>
      <movies-list :movies="movies"></movies-list>
    </div>
   <ma-pagination :page="page" :total-pages="totalPages" @change="changePage"></ma-pagination>
  </div>
</template>

<style scoped>
.selected {
  background-color: #0000FF;
  color: #FFFFFF;
}

</style>