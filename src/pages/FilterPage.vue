<script setup>
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import MoviesList from "@/components/MoviesList.vue";
import useMoviesGenres from "@/composable/useMoviesGenres";

const movies = ref([])

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
const rangeLabels = Array.from({length: 10}, (_, i) => i);

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
    movies.value = response.data.results
    totalPages.value = response.data.total_pages
}

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
    <div class="filter-page">
        <div class="menu">
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
            <div class="range-container">
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    v-model="rating"
                >
                <div class="range-labels">
                    <span v-for="label in rangeLabels" :key="label">{{ label + 1 }}</span>
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
        </div>
        <div>
            <movies-list :movies="movies"></movies-list>
        </div>
        <ma-pagination :page="page" :total-pages="totalPages" @change="changePage"></ma-pagination>
    </div>
</template>

<style scoped>
.menu {
    display: flex;
    max-width: 900px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.filter-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.select__solo {
    border-radius: 10px;
    background-color: transparent;
    color: #FFFFFF;
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
    position: relative;
}

input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    margin: 5px 0;
    background-color: #ddd;
    border-radius: 5px;
    outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    background: #b8860b;
    border-radius: 5px;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;
}

.range-labels {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 30px;
    width: 100%;
}

.range-labels span {
    color: #FFFFFF;
    position: relative;
    width: 20px;
    text-align: center;
}
</style>