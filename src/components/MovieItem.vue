<script setup>

import useMoviesGenres from "@/composition/useMoviesGenres";

const props = defineProps({
  movie: Object,
  required: true,
})

function getMoviePosterUrl(posterPath) {
  if(!posterPath) return

  return `https://image.tmdb.org/t/p/w200${posterPath}`
}

const { getGenresFromMovie } = useMoviesGenres()
</script>

<template>
  <div class="movie">
    <div class="move__title">
      <img
          :src="getMoviePosterUrl(movie.poster_path)"
           :alt="movie.title">
    </div>
      <div class="movie__content">
       <div>
         <h3>{{movie.title}}</h3>
         <p style="margin-top: 10px">
           {{movie.original_title}},
           {{movie.release_date}},
           {{movie.original_language}}
         </p>
       </div>
        <div>
            <ul style="display: flex; flex-wrap: wrap; list-style: none">
              <li v-for="genre in getGenresFromMovie(movie.genre_ids)">
                <input
                    class="movie_genres"
                    type="text"
                    readonly
                    :value="genre"
                >
              </li>
            </ul>
        </div>
        <p>{{movie.overview}}</p>
      </div>
      <div class="movie__appraisal">
        <p class="movie__vote-average">
          {{ movie.vote_average !== 'undefined' ? movie.vote_average : 0 }}
        </p>
        <p style="color: rgba(0,0,0,.6);">{{movie.vote_count}}</p>
      </div>
  </div>
</template>

<style scoped>
.movie {
  padding: 15px;
  width: 100%;
  max-width: 850px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  border-radius: 16px;
}
.movie:hover {
  background-color: #f7f7f7;
}
.movie__content {
  padding: 10px 0;
  margin-left: 5px;
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.movie__vote-average {
  margin-right: 5px;
  color: #00008B;
  font-size: 20px;
  font-weight: 600;
}
.movie__appraisal {
  margin-left: 5px;
  display: flex;
}
.movie_genres {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 3px;
  width: 150px;
  color: #333;
  background-color: #f0f0f0;
}
.move__title {
  display: flex;
}
</style>