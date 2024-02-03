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
  <div v-if="movies.length > 0" class="lists">
      <movie-item :movie="movie" v-for="movie in movies" :key="movie.id"></movie-item>
  </div>
  <div v-else>
    <h3 style="color: red;">Lists is empty</h3>
  </div>
</template>

<style scoped>
.lists {
    margin-top: 40px;
}
</style>