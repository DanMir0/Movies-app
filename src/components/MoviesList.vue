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
  <div v-else class="block">
      <div class="content">
          <h2>Lists is empty</h2>
      </div>
  </div>
</template>

<style scoped>
.lists {
    margin-top: 40px;
}

h2 {
    color: #ffffff;
    text-align: center;
}
.block {
    display: flex;
    justify-content: center;
}
.content {
    padding: 50px;
    max-width: 450px;
    width: 100%;
    border: 1px solid #424242;
    border-radius: 7px;
}
</style>