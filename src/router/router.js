import {createRouter, createWebHistory} from 'vue-router';
import SearchPage from "@/pages/SearchPage.vue";
import FilterPage from "@/pages/FilterPage.vue";
import DetailsMoviePage from "@/pages/DetailsMoviePage.vue";
import LoginPage from "@/pages/LoginPage.vue";

const routes = [
    {
        path: '/',
        name: 'LoginPage',
        component: LoginPage,
    },
    {
        path: '/filter',
        name: 'FilterPage',
        component: FilterPage,
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