import { createRouter, createWebHistory } from 'vue-router';
import SearchedPage from "@/pages/SearchedPage.vue";

const routes = [
    {
        path: '/search',
        component: SearchedPage
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router