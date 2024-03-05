<script setup>
import axios from "axios";
import {computed, onMounted, ref, watch} from "vue";
import MoviesList from "@/components/MoviesList.vue";
import useMoviesGenres from "@/composable/useMoviesGenres";
import useUser from "@/composable/useUser";

const moviesOrigin = ref([])
const {user} = useUser()
const selectedYear = ref('')

const sortOptions = ref([
    {value: 'popularity.asc', name: 'Popularity asc'},
    {value: 'popularity.desc', name: 'Popularity desc'},
    {value: 'primary_release_date.asc', name: 'Release date asc'},
    {value: 'primary_release_date.desc', name: 'Release date desc'},
    {value: 'vote_average.asc', name: 'Vote average asc'},
    {value: 'vote_average.desc', name: 'Vote average desc'},
])
const selectedSort = ref('popularity.desc')

const selectedGenres = ref([])

const rating = ref()

const page = ref(1)
const totalPages = ref(1)

const {genres} = useMoviesGenres()
const filterMovies = async () => {
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
    moviesOrigin.value = response.data.results

    totalPages.value = response.data.total_pages
}

const movies = computed(() => {
      return  moviesOrigin.value.map(movie => {
          if (user.value.uid && user.value.favorites) {
              movie.isFavorite = !!user.value.favorites.includes(movie.id);
          } else {
              movie.isFavorite = false
          }
          return movie
      })
})


const genreChange = (idGenre) => {
    if (selectedGenres.value.includes(idGenre)) {
        selectedGenres.value = selectedGenres.value.filter(id => id !== idGenre)
    } else {
        selectedGenres.value.push(idGenre)
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
    <main class="filter-page">
        <section class="menu">
            <select class="select__solo" v-model="selectedYear">
                <option class="option__solo" disabled value="">Year...</option>
                <option
                    class="option__solo"
                    v-for="year in 24"
                    :key="year"
                    :value="2000 + year"
                >
                    {{ 2000 + year }}
                </option>
            </select>
            <div>
                <div class="help-range"><span>{{rating}}</span></div>
                <div class="range-container">
                    <span>1</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        v-model="rating"
                    >
                    <span>10</span>
                </div>
            </div>
            <ma-multi-select :genres="genres" @genreChange="genreChange"></ma-multi-select>
            <select class="select__solo" v-model="selectedSort">
                <option class="option__solo" value="">Select from the list</option>
                <option
                    class="option__solo"
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.name }}
                </option>
            </select>
        </section>
        <section>
            <movies-list :movies="movies"></movies-list>
        </section>
        <ma-pagination :page="page" :total-pages="totalPages" @change="changePage"></ma-pagination>
    </main>
</template>

<style scoped>
.menu {
    display: flex;
    max-width: 900px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 10px;
}

.filter-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.select__solo {
    border-radius: 10px;
    background-color: transparent;
    display: flex;
    width: 250px;
    height: 40px;
    padding: 10px; /* Регулируйте отступы по вашему желанию */
    font-size: 15px
}

.option__solo {
    padding: 10px;
    min-height: 40px;
    display: flex;
    align-items: center;
    background: #333;
    border-top: #222 solid 1px;
    font-size: 15px;
}

.range-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    border-radius: 16px;
}

input[type="range"]::-webkit-slider-runnable-track {
    height: 15px;
    background: #424242;
    border-radius: 16px;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 15px;
    width: 15px;
    background-color: #fff;
    border-radius: 50%;
    border: 2px solid #b8860b;
    box-shadow: -407px 0 0 400px #b8860b;
}

.help-range {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border: 4px solid #b8860b;
    border-bottom-left-radius: 50%;
    border-top-right-radius: 50%;
    border-top-left-radius: 50%;
    transform: rotate(45deg);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 5px;
    left: 60px;
}
.help-range span {
    align-items: center;
    background: transparent;
    transform: rotate(315deg);
    position: absolute;
    color: #000000;
}
</style>