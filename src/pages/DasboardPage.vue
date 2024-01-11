<template>
  <div>
    <h1>List movies</h1>
  <div>
   <input
       placeholder="Searh..."
       v-model="searchQuery"
   >
  </div>
    <div class="container">
      <movies-list
          :movies="searchedMovies"
      ></movies-list>
    </div>
  </div>
</template>

<script setup>
import useMoviesPopular from "@/hooks/useMovies";
import MoviesList from "@/components/MoviesList.vue";
import useSearchedMovies from "@/hooks/useSearchedMovies";


const { moviesPopular } = useMoviesPopular()
const { searchQuery, searchedMovies } = useSearchedMovies(moviesPopular)


</script>

<style scoped>
.container {
  margin: 0 auto;
 max-width: 1600px;
  width: 100%;
}
</style>