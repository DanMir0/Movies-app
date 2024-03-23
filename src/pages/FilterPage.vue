<script setup>
import axios from "axios";
import {computed, onMounted, ref, watch} from "vue";
import MoviesList from "@/components/MoviesList.vue";
import useMoviesGenres from "@/composable/useMoviesGenres";
import useUser from "@/composable/useUser";

const moviesOrigin = ref([])
const {user} = useUser()
const selectedYear = ref('')
const showFilterDropdown = ref(false);
const showNestedDropdownYear = ref(false);
const showNestedDropdownGenres = ref(false)
const showNestedDropdownRating = ref(false)
const showSortDropdown = ref(false)

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

const startRating = ref()
const endRating = ref()

const page = ref(1)
const totalPages = ref(1)

const {genres} = useMoviesGenres()

const toggleFilterDropdown = () => {
    showFilterDropdown.value = !showFilterDropdown.value;
    if (showNestedDropdownYear.value) {
        showNestedDropdownYear.value = false
    }
    if (showNestedDropdownGenres.value) {
        showNestedDropdownGenres.value = false
    }
    if (showNestedDropdownRating.value) {
        showNestedDropdownRating.value = false
    }
    if (showSortDropdown.value) {
        showSortDropdown.value = false
    }
};
const toggleSortDropdown = () => {
    showSortDropdown.value = !showSortDropdown.value
    if (showFilterDropdown.value) {
        showFilterDropdown.value = false
    }
}
const toggleNestedDropdownYear = () => {
    showNestedDropdownYear.value = !showNestedDropdownYear.value
};
const toggleNestedDropdownGenres = () => {
    showNestedDropdownGenres.value = !showNestedDropdownGenres.value
};

const toggleNestedDropdownRating = () => {
    showNestedDropdownRating.value = !showNestedDropdownRating.value
};

const onSelectedSort = (sort) => {
    selectedSort.value = sort
}

const filterMovies = async () => {
    const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
            api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
            'primary_release_year': selectedYear.value,
            'vote_average.gte': startRating.value,
            'vote_average.lte': endRating.value = 10,
            'with_genres': selectedGenres.value.join(','),
            'sort_by': selectedSort.value,
            'page': page.value
        }
    })
    moviesOrigin.value = response.data.results

    totalPages.value = response.data.total_pages
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

watch([selectedYear, startRating, endRating, selectedSort], () => {
    page.value = 1
    filterMovies()
})
</script>

<template>
    <main class="filter-page">
        <section class="menu">
            <div class="dropdown">
                <div @click="toggleFilterDropdown" class="dropdown__title">
                    <span class="dropdown__icon-filter"></span>
                    <p class="desktop">Filter</p>
                </div>
                <div @click="toggleSortDropdown" class="dropdown__title">
                    <span class="dropdown__icon-sort"></span>
                    <p class="desktop">Sort</p>
                </div>
                <div v-if="showFilterDropdown" class="dropdown__content">
                    <ul class="dropdown__lists">
                        <li class="dropdown__nested-item" @click="toggleNestedDropdownYear">
                            <span class="dropdown__icon dropdown__icon-next"></span>
                            <span class="transparent">Year</span>
                        </li>
                        <li class="dropdown__nested-item" @click="toggleNestedDropdownGenres">
                            <span class="dropdown__icon dropdown__icon-next"></span>
                            <span class="transparent">Genres</span>
                        </li>
                        <li class="dropdown__nested-item" @click="toggleNestedDropdownRating">
                            <span class="dropdown__icon dropdown__icon-next"></span>
                            <span class="transparent">Rating</span>
                        </li>
                    </ul>
                </div>
                <div v-if="showNestedDropdownYear" class="dropdown__content">
                    <ul class="dropdown__lists">
                        <li class="dropdown__nested-name" @click="toggleNestedDropdownYear">
                            <span class="dropdown__icon dropdown__icon-back"></span>
                            <h4 class="transparent">Year</h4>
                        </li>
                        <li v-for="year in 24" :key="year" class="dropdown__nested-item">
                            <input type="radio" :id="'year-'+ year" :value="2000 + year" v-model="selectedYear">
                            <p class="transparent">{{ 2000 + year }}</p>
                        </li>
                    </ul>
                </div>
                <div v-if="showNestedDropdownGenres" class="dropdown__content">
                    <ul class="dropdown__lists">
                        <li @click="toggleNestedDropdownGenres" class="dropdown__nested-name">
                            <span class="dropdown__icon dropdown__icon-back"></span>
                            <h4 class="transparent">Genres</h4>
                        </li>
                        <li v-for="genre in genres" :key="genre.id" class="dropdown__nested-item"
                            @click="genreChange(genre.id)">
                            <input type="checkbox" :id="genre.id" :value="genre.id" v-model="selectedGenres">
                            <p class="transparent">{{ genre.name }}</p>
                        </li>
                    </ul>
                </div>
                <div v-if="showNestedDropdownRating" class="dropdown__content">
                    <div @click="toggleNestedDropdownRating" class="dropdown__nested-name">
                        <span class="dropdown__icon dropdown__icon-back"></span>
                        <h4 class="transparent">User rating</h4>
                    </div>
                    <div class="dropdown__nested-rating">
                        <ma-input v-model="startRating"/>
                        <p>to</p>
                        <ma-input v-model="endRating"/>
                    </div>

                </div>
                <div v-if="showSortDropdown" class="dropdown__content dropdown__content-sort">
                    <ul class="dropdown__lists">
                        <li v-for="option in sortOptions" :key="option.value" :value="option.value"
                            class="dropdown__nested-item">
                            <p class="transparent" @click="onSelectedSort(option.value)">{{ option.name }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <section>
            <movies-list :movies="movies"></movies-list>
        </section>
        <ma-pagination :page="page" :total-pages="totalPages" @change="changePage"></ma-pagination>
    </main>
</template>

<style scoped>
.dropdown {
    position: relative;
    display: flex;
    justify-content: flex-end;
}
.menu {
    max-width: 1130px;
    margin: 0 20px;
}
.dropdown__content {
    position: absolute;
    padding: 10px;
    top: 100%;
    right: 30px;
    border: 1px solid #555454;
    min-width: 120px;
    z-index: 1;
}

input[type="radio"], input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 4px; /* Для закругления углов */
    outline: none;
    cursor: pointer;
}

input[type="radio"]:checked, input[type="checkbox"]:checked {
    background-color: #b8860b;
}

.dropdown__nested-item {
    padding: 5px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 7px;
}

.dropdown__nested-item:hover,
.dropdown__nested-item:focus,
.dropdown__nested-name:hover,
.dropdown__nested-name:focus {
    background-color: #303030;
}

.dropdown__lists {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.dropdown__icon {
    background-color: transparent;
    position: absolute;
    width: 15px;
    height: 15px;
    background-size: cover;
    background-repeat: no-repeat;
}

.dropdown__icon-next {
    right: 10px;
    background-image: url("/src/icons/arrow-next.svg");
}

.dropdown__icon-back {
    left: 10px;
    background-image: url("/src/icons/arrow-back.svg");
}

.dropdown__icon-filter {
    width: 30px;
    display: block;
    height: 30px;
    background-image: url("/src/icons/filter.svg");
    background-repeat: no-repeat;
}

.dropdown__nested-name {
    border-bottom: 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    padding-bottom: 5px;
}

.transparent {
    background: transparent;
}

.dropdown__title {
    display: flex;
    align-items: center;
    gap: 6px;
}

.dropdown__nested-rating {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dropdown__icon-sort {
    width: 30px;
    height: 30px;
    display: block;
    background-image: url("/src/icons/sort.svg");
    background-repeat: no-repeat;
}

@media screen and (max-width: 1024px) {
    .desktop {
        display: none;
    }
    .menu {
        max-width: 793px;
    }
}

@media screen and (max-width: 375px) {
    .desktop {
        display: none;
    }
    .menu {
        margin: 0 10px;
    }
}
</style>