<script setup>
import MovieItem from "@/components/MovieItem.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true,
  }
})
</script>

<template>
  <div>
    <movie-item :movie="movie" v-for="movie in movies" :key="movie.id"></movie-item>
  </div>
</template>

<style scoped>

</style>