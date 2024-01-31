import { createRouter, createWebHistory } from 'vue-router';
import SearchPage from "@/pages/SearchPage.vue";
import FilterPage from "@/pages/FilterPage.vue";
import DetailsMoviePage from "@/pages/DetailsMoviePage.vue";

const routes = [
    {
        path: '/filter',
        name: 'FilterPage',
        component: FilterPage,
        alias: '/'
    },
    {
        path: '/search/',
        name: 'SearchPage',
        component: SearchPage,
        props: true
    },
    {
        path: '/movie/{:movie_id}',
        name: 'movie-details',
        component: DetailsMoviePage
    }

]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router