<script setup>
import axios from "axios";
import { ref, watchEffect} from "vue";
import MoviesList from "@/components/MoviesList.vue";
import useMoviesGenres from "@/composition/useMoviesGenres";

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
const selectedGenres = ref([])

const rating = ref()

const { genres } = useMoviesGenres()
const filterMovies = async () => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: {
        api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
        'primary_release_year': selectedYear.value,
        'vote_average.gte': rating.value,
        'vote_average.lte': 10,
        'with_genres': selectedGenres.value.join(',')
      }
    })
    movies.value = response.data.results
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
};

watchEffect(() => {
  filterMovies()
})


</script>

<template>
  <div>
    <div>
      <select v-model="selectedYear" >
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
            @click="handleGenreChange(genre.id)"
        >
          {{genre.name}}
        </option>
      </select>
    </div>
    <div>
      <movies-list :movies="movies"></movies-list>
    </div>
  </div>
</template>

<style scoped>

</style>