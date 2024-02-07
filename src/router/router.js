import {createRouter, createWebHistory} from 'vue-router';
import SearchPage from "@/pages/SearchPage.vue";
import DetailsMoviePage from "@/pages/DetailsMoviePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import MaNavbar from "@/components/UI/MaNavbar.vue";
import FilterPage from "@/pages/FilterPage.vue";
import RegistrationPage from "@/pages/RegistrationPage.vue";
import ResetPassPage from "@/pages/ResetPassPage.vue";

const routes = [
    {
        path: '/',
        name: 'LoginPage',
        component: LoginPage,
    },
    {
        path: '/movies',
        component: MaNavbar,
        children: [
            {
                path: '',
                name: 'FilterPage',
                component: FilterPage
            },
            {
                path: 'movies/search/',
                name: 'SearchPage',
                component: SearchPage,
                props: true
            },
            {
                path: '/movies/{:movie_id}',
                name: 'movie-details',
                component: DetailsMoviePage
            },
        ]
    },
    {
        path: '/sign-up',
        name: 'RegistrationPage',
        component: RegistrationPage,
    },
    {
        path: '/reset-password',
        name: 'ResetPasswordPage',
        component: ResetPassPage,
    },

]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router