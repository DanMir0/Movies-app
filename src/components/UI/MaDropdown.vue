<script setup>
import {ref} from "vue";
import useMoviesGenres from "@/composable/useMoviesGenres";
import router from "@/router/router";
import {useRoute} from "vue-router";

const route = useRoute()
const showFilterDropdown = ref(false);
const showNestedDropdownYear = ref(false);
const showNestedDropdownGenres = ref(false)
const showNestedDropdownRating = ref(false)
const showSortDropdown = ref(false)

const queryParams = ref({
    startRating: 0,
    endRating: 10,
    genres: []
})

const sortOptions = ref([
    {value: 'popularity.asc', name: 'Popularity asc'},
    {value: 'popularity.desc', name: 'Popularity desc'},
    {value: 'primary_release_date.asc', name: 'Release date asc'},
    {value: 'primary_release_date.desc', name: 'Release date desc'},
    {value: 'vote_average.asc', name: 'Vote average asc'},
    {value: 'vote_average.desc', name: 'Vote average desc'},
])

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

const genreChange = (idGenre) => {
    if (queryParams.value.genres.includes(idGenre)) {
        queryParams.value.genres = queryParams.value.genres.filter(id => id !== idGenre)
    } else {
        queryParams.value.genres.push(idGenre)
    }

    router.push({query: {...queryParams.value, page: 1, genres: queryParams.value.genres}});
}

function yearChange(year) {
    router.push({query: {...route.query, page: 1, year: year}});
}

function ratingChange() {
    router.push({
        query: {
            ...route.query,
            page: 1,
            startRating: queryParams.value.startRating,
            endRating: queryParams.value.endRating
        }
    })
}
</script>

<template>
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
                    <input type="radio" :id="'year-'+ year" :value="2000 + year"
                           @click="yearChange(2000 + year)">
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
                    <input type="checkbox" :id="genre.id" :value="genre.id" v-model="queryParams.genres">
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
                <ma-input v-model="queryParams.startRating" @change="ratingChange"/>
                <p>to</p>
                <ma-input v-model="queryParams.endRating" @change="ratingChange"/>
            </div>

        </div>
        <div v-if="showSortDropdown" class="dropdown__content dropdown__content-sort">
            <ul class="dropdown__lists">
                <li v-for="option in sortOptions" :key="option.value" :value="option.value"
                    class="dropdown__nested-item">
                    <router-link class="sort"
                                 :to="{name:'FilterPage', query:{...route.query, page:1, sort:option.value}}">
                        {{ option.name }}
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
    display: flex;
    justify-content: flex-end;
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

.sort {
    background-color: transparent;
    text-decoration: none;
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

@media screen and (max-width: 1024px) {
    .desktop {
        display: none;
    }
}

@media screen and (max-width: 375px) {
    .desktop {
        display: none;
    }
}
</style>