<script setup>
import axios from "axios";
import {computed, ref, watchEffect} from "vue";
import MoviesList from "@/components/MoviesList.vue";
import useMoviesGenres from "@/composition/useMoviesGenres";
import MyNavbar from "@/components/UI/MyNavbar.vue";

const movies = ref([])

const filterYear = ref([
  {value: 2024, name: 2024},
  {value: 2023, name: 2023},
  {value: 2022, name: 2022},
  {value: 2021, name: 2021},
  {value: 2020, name: 2020},
  {value: 2019, name: 2019},
  {value: 2018, name: 2018},
  {value: 2017, name: 2017},
  {value: 2016, name: 2016},
  {value: 2015, name: 2015},
  {value: 2014, name: 2014},
  {value: 2013, name: 2013},
  {value: 2012, name: 2012},
  {value: 2011, name: 2011},
  {value: 2010, name: 2010},
  {value: 2009, name: 2009},
  {value: 2008, name: 2008},
  {value: 2007, name: 2007},
  {value: 2006, name: 2006},
  {value: 2005, name: 2005},
  {value: 2004, name: 2004},
  {value: 2003, name: 2003},
  {value: 2002, name: 2002},
  {value: 2001, name: 2001},
  {value: 2000, name: 2000},
])
const selectedYear = ref()

const sortOptions = ref([
  { value: 'popularity.asc', name: 'Popularity asc'},
  { value: 'popularity.desc', name: 'Popularity desc'},
  { value: 'primary_release_date.asc', name: 'Release date asc'},
  { value: 'primary_release_date.desc', name: 'Release date desc'},
  { value: 'vote_average.asc', name: 'Vote average asc'},
  { value: 'vote_average.desc', name: 'Vote average desc'},
])
const selectedSort = ref()

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

function handleGenreChange(genreId) {
  if (selectedGenres.value.includes(genreId)) {
    selectedGenres.value = selectedGenres.value.filter((id) => id !== genreId);
  } else {
    selectedGenres.value.push(genreId);
  }
}

function changePage(pageNumber) {
  if (pageNumber !== '...') {
    page.value = pageNumber
  }
}

watchEffect(() => {
  filterMovies()
})

const displayedPages = computed(() => {
  const result = [];
  const totalDisplayPages = 5;

  if (totalPages.value <= totalDisplayPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      result.push(i);
    }
  } else {
    const leftEllipsis = page.value > totalDisplayPages - 2;
    const rightEllipsis = page.value < totalPages.value - (totalDisplayPages - 1);

    if (!leftEllipsis) {
      result.push(...Array(totalDisplayPages - 1).fill().map((_, i) => i + 1));
      result.push('...');
      result.push(totalPages.value);
    } else if (!rightEllipsis) {
      result.push(1, '...');
      for (let i = totalPages.value - (totalDisplayPages - 1); i <= totalPages.value; i++) {
        result.push(i);
      }
    } else {
      result.push(1, '...');
      for (let i = page.value - Math.floor(totalDisplayPages / 2); i <= page.value + Math.floor(totalDisplayPages / 2); i++) {
        result.push(i);
      }
      result.push('...');
      result.push(totalPages.value);
    }
  }
  return result;
});
function prevPage() {
  return page.value -= 1
}
function nextPage() {
  return page.value += 1
}

</script>

<template>
  <div>
    <my-navbar></my-navbar>
  </div>
  <div>
    <div>
      <select v-model="selectedYear">
        <option disabled value="">Year...</option>
        <option
            v-for="year in filterYear"
            :key="year.value"
            :value="year.value"
        >
          {{year.name}}
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
   <div class="pagination" v-if="movies.length > 0">
    <ul class="page__wrapper">
      <li @click="prevPage"><span>Prev</span></li>
      <li
          v-for="pageNumber in displayedPages"
          :key="pageNumber"
          class="page"
          :class="{'current-page': page === pageNumber}"
          @click="changePage(pageNumber)"
      >
        {{pageNumber}}
      </li>
      <li @click="nextPage"><span>Next</span></li>
    </ul>
   </div>
  </div>
</template>

<style scoped>
.selected {
  background-color: #0000FF;
  color: #FFFFFF;
}
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