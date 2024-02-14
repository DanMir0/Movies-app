<script setup>
import axios from "axios";
import {onMounted, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";
import useUser from "@/composable/useUser";
import useComments from "@/composable/useComments";
import MaGrades from "@/components/UI/MaGrades.vue";

let props = defineProps({
  movie_id: {
    required: true
  }
})

let movieId = null

let currentUserId = ref('')
let username = ' '

let movie = ref([])
const grades = ref(0)
const inputComment = ref('')
const {getCurrentUser} = useUser()

function updateGrades(val) {
  grades.value = val
  console.log(grades.value)
}

const {addComments, comments, deleteComment} = useComments()
const fetching = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${props.movie_id}`, {
    params: {
      api_key: '42b000d5a4c2a76ed3400dcd6cd491e0',
    }
  })
  movie.value = response.data
  movieId = response.data.id
}

function getMoviePosterUrl(posterPath) {
  if (!posterPath) return
  return `https://image.tmdb.org/t/p/w200${posterPath}`
}

const addComment = async () => {
  await addComments(movieId, currentUserId.value, username, inputComment.value, grades.value)
  grades.value = 0
}

watchEffect(async () => {
  await fetching()
})

onMounted(async () => {
  let user = await getCurrentUser()
  currentUserId.value = user ? user.uid : ''
  username = user ? user.displayName : ''
})
</script>

<template>
  <div class="movie__page">
    <router-link :to="{name: 'movie-details', params: {movie_id: 66666}}">GO 6666</router-link>
    <div class=movie>
      <div>
        <img :src="getMoviePosterUrl(movie.poster_path)" :alt="movie.title">
        <div class="movie__grades">
          <div class="group__grades">
            <svg fill="#ffffff" width="30px" height="30px" viewBox="0 0 32 32"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M 0 7 L 0 25 L 32 25 L 32 7 Z M 2 9 L 30 9 L 30 23 L 2 23 Z M 5 11.6875 L 5 20.3125 L 7 20.3125 L 7 11.6875 Z M 8.09375 11.6875 L 8.09375 20.3125 L 10 20.3125 L 10 15.5 L 10.90625 20.3125 L 12.1875 20.3125 L 13 15.5 L 13 20.3125 L 14.8125 20.3125 L 14.8125 11.6875 L 12 11.6875 L 11.5 15.8125 L 10.8125 11.6875 Z M 15.90625 11.6875 L 15.90625 20.1875 L 18.3125 20.1875 C 19.613281 20.1875 20.101563 19.988281 20.5 19.6875 C 20.898438 19.488281 21.09375 19 21.09375 18.5 L 21.09375 13.3125 C 21.09375 12.710938 20.898438 12.199219 20.5 12 C 20 11.800781 19.8125 11.6875 18.3125 11.6875 Z M 22.09375 11.8125 L 22.09375 20.3125 L 23.90625 20.3125 C 23.90625 20.3125 23.992188 19.710938 24.09375 19.8125 C 24.292969 19.8125 25.101563 20.1875 25.5 20.1875 C 26 20.1875 26.199219 20.195313 26.5 20.09375 C 26.898438 19.894531 27 19.613281 27 19.3125 L 27 14.3125 C 27 13.613281 26.289063 13.09375 25.6875 13.09375 C 25.085938 13.09375 24.511719 13.488281 24.3125 13.6875 L 24.3125 11.8125 Z M 18 13 C 18.398438 13 18.8125 13.007813 18.8125 13.40625 L 18.8125 18.40625 C 18.8125 18.804688 18.300781 18.8125 18 18.8125 Z M 24.59375 14 C 24.695313 14 24.8125 14.105469 24.8125 14.40625 L 24.8125 18.6875 C 24.8125 18.886719 24.792969 19.09375 24.59375 19.09375 C 24.492188 19.09375 24.40625 18.988281 24.40625 18.6875 L 24.40625 14.40625 C 24.40625 14.207031 24.394531 14 24.59375 14 Z"/>
            </svg>
            <p>{{ parseFloat(movie.vote_average).toFixed(1) }}</p>
          </div>
          <div class="group__grades">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z"
                  stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>{{ movie.vote_count }}</p>
          </div>
          <div class="group__grades">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_15_200)">
                <circle cx="12" cy="13" r="2" stroke="#ffffff" stroke-linejoin="round"/>
                <path
                    d="M12 7.5C7.69517 7.5 4.47617 11.0833 3.39473 12.4653C3.14595 12.7832 3.14595 13.2168 3.39473 13.5347C4.47617 14.9167 7.69517 18.5 12 18.5C16.3048 18.5 19.5238 14.9167 20.6053 13.5347C20.8541 13.2168 20.8541 12.7832 20.6053 12.4653C19.5238 11.0833 16.3048 7.5 12 7.5Z"
                    stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_15_200">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <p>{{ parseFloat(movie.popularity).toFixed() }}</p>
          </div>
        </div>
      </div>
      <div class="movie__description">
        <h2>{{ movie.title }}</h2>
        <div class="movie__items">
          <div class="movie__items-name">
            <p>Name:</p>
            <p>Country:</p>
            <p>Genre:</p>
            <p>Budget:</p>
            <p>Revenue:</p>
            <p>Official website:</p>
            <p>IMDB:</p>
          </div>
          <div class="movie__items-value">
            <p>{{ movie.original_title }}</p>
            <div class="group__item"><p v-for="(country, index) in movie.production_countries">
              {{ country.name + (index < movie.production_countries.length - 1 ? ',&nbsp;' : ' ') }}</p>
            </div>
            <div class="group__item"><p v-for="(genre, index) in movie.genres">
              {{ genre.name + (index < movie.genres.length - 1 ? ',&nbsp;' : ' ') }}</p></div>
            <p>${{
                movie.budget ? movie.budget.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }) : ''
              }}</p>
            <p>${{
                movie.revenue ? movie.revenue.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }) : ''
              }}</p>
            <a :href="movie.homepage">{{ movie.homepage }}</a>
            <a :href="`https://www.imdb.com/title/${movie.imdb_id}`">https://www.imdb.com/title/{{
                movie.imdb_id
              }}</a>
          </div>
        </div>
        <p>{{ movie.overview }}</p>
      </div>
    </div>
    <div class="comments__container">
      <h3>Comments:</h3>
      <div class="comments__add" v-if="currentUserId">
        <ma-grades @take-grades="updateGrades" class="comments__add-grades"></ma-grades>
        <textarea rows="5" class="input__add" placeholder="Add a comment..." v-model="inputComment"></textarea>
        <button class="btn__add" @click="addComment">Add</button>
      </div>
      <div class="comments">
        <div class="comment" v-for="comment in comments" :key="comment.id">
          <!--                    <img :src="comment.photo">-->
          <div class="comment__body">
            <div class="comment__head">
              <span class="username">{{ comment.username }}</span>
              <ma-grades :closeEdit="true" :grade="comment.grade"></ma-grades>
            </div>
            <div class="comment__down">
              <p>{{ comment.comment }}</p>
              <button v-if="currentUserId === comment.userId" class="btn__delete"
                      @click="deleteComment(movieId, comment.id)">Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.movie__page {
  margin: 0 20px;
}

.movie {
  margin-top: 20px;
  display: flex;
}

.movie a:hover {
  cursor: pointer;
  opacity: 0.9;
}

.movie__description {
  margin-left: 15px;
}

.movie__items {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
}

.group__item {
  display: flex;
  flex-direction: row;
}

.movie__items-value {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.movie__items-name {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.movie__grades {
  display: flex;
  justify-content: space-around;
}

.group__grades {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.comments__container {
  margin-top: 50px;
}

.comments__add {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input__add {
  border: none;
  border-bottom: 1px solid #424242;
  border-radius: 0px;
}

.input__add:focus {
  outline: none;
}

.btn__add {
  padding: 0.5em 2em;
  max-width: 100px;
  width: 100%;
  background-color: #303030;
  border: none;
}

.btn__add:hover {
  background-color: #3e3e3e;
  cursor: pointer;
}

.comment {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.comments {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn__delete {
  font-size: 16px;
  border: none;
  width: 50px;
  color: #999999;
  border-bottom: 1px dashed;
}

.btn__delete:hover {
  cursor: pointer;
  opacity: 0.8;
}

.comment__body {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.comment__down {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.comments__add-grades {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.comment__head {
  display: flex;
  gap: 15px;
}
</style>