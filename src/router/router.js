import {createRouter, createWebHistory} from 'vue-router';
import SearchPage from "@/pages/SearchPage.vue";
import DetailsMoviePage from "@/pages/DetailsMoviePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import MaNavbar from "@/components/UI/MaNavbar.vue";
import FilterPage from "@/pages/FilterPage.vue";
import RegistrationPage from "@/pages/RegistrationPage.vue";
import ResetPassPage from "@/pages/ResetPassPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import useUser from "@/composable/useUser";
import NotFound from "@/pages/NotFound.vue";
import FavoritesPage from "@/pages/FavoritesPage.vue";

const {getCurrentUser} = useUser()

const routes = [
    {
        path: '/:pathMatch(.*)',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/sign-in',
        name: 'LoginPage',
        component: LoginPage,
    },
    {
        path: '/',
        component: MaNavbar,
        children: [
            {
                path: '',
                name: 'FilterPage',
                component: FilterPage
            },
            {
                path: '/search/',
                name: 'SearchPage',
                component: SearchPage,
                props: true
            },
            {
                path: '/:movie_id',
                name: 'movie-details',
                component: DetailsMoviePage,
                props: true
            },
            {
                path: '/profile',
                name: 'ProfilePage',
                component: ProfilePage,
                meta: {requiresAuth: true}
            },
            {
                path: '/favorites',
                name: 'FavoritesPage',
                component: FavoritesPage,
                meta: {requiresAuth: true}
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

router.beforeEach(async (to,from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
     const user = await getCurrentUser();
        if (user) {
         next()
     } else {
         next({name: 'LoginPage'})
     }
    } else {
        next()
    }
})
export default router