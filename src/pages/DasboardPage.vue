<template>
  <div>
    <h1>List movies</h1>
  <div style="display: flex">
    <div>
      <ul>
        <li v-for="genre in genresList" :key="genre.id">
          <input
              type="text"
              readonly
              :value="genre.name"
              :class="{selected: selectedGenres.includes(genre.id)}"
              @click="toggleGenreSelection(genre.id)"
          >
        </li>
      </ul>
    </div>
   <input
       placeholder="Search..."
       v-model.trim="searchQuery"
   >
  </div>
    <div class="container">
      <movies-list
          :movies="searchResults.length === 0 ? moviesPopular : searchResults "
      ></movies-list>
    </div>
  </div>
</template>

<script setup>
import useMoviesPopular from "@/hooks/useMovies";
import MoviesList from "@/components/MoviesList.vue";
import useSearchedMovies from "@/hooks/useSearchedMovies";
import {ref, watch} from "vue";
import useGenresList from "@/hooks/useGenresList";
const selectedGenres = ref([])
const { genresList } = useGenresList()
const { moviesPopular } = useMoviesPopular()
const { searchQuery, searchResults, searchByGenres } = useSearchedMovies()


function toggleGenreSelection(genreId) {
  if (selectedGenres.value.includes(genreId)) {
    selectedGenres.value = selectedGenres.value.filter(id => id !== genreId)
  } else {
    selectedGenres.value.push(genreId)
  }
  searchByGenres(selectedGenres)
}

</script>

<style scoped>
.selected {
  background-color: blue; /* Любой стиль, который вы хотите использовать для выбранного жанра */
  color: white; /* Пример: текст белого цвета в выбранном жанре */
}
.container {
  margin: 0 auto;
 max-width: 1600px;
  width: 100%;
}
</style>