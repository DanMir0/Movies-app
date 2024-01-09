<template>
  <div>
    <h1>Список фильмов</h1>
    <div class="container">
      <movies-list
          :movies="moviesPopular"
      ></movies-list>
    </div>
  </div>
</template>

<script setup>
import useMoviesPopular from "@/hooks/useMovies";
import MoviesList from "@/components/MoviesList.vue";

const { moviesPopular } = useMoviesPopular()

</script>

<style scoped>
.container {
  margin: 0 auto;
 max-width: 1600px;
  width: 100%;
}
</style>