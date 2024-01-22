import { createRouter, createWebHistory } from 'vue-router';
import SearchPage from "@/pages/SearchPage.vue";
import FilterPage from "@/pages/FilterPage.vue";

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

]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router