<template>
  <div>
    <h1>Список фильмов</h1>
    <ul>
      <li v-for="movie in moviesPopular" :key="movie.id">
        <h3>{{movie.title}}</h3>
        <div>
          <p>{{movie.overview}}</p>
        </div>

      </li>
    </ul>
  </div>
</template>

<script>
import useMoviesPopular from "@/hooks/useMovies";
export default {
 setup(props) {
   const { moviesPopular } = useMoviesPopular()
   console.log(moviesPopular)
   return {
     moviesPopular
   }
 }
}
</script>

<style lang="scss" scoped>

</style>