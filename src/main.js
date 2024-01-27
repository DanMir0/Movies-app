import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import MaPagination from "@/components/UI/MaPagination.vue";

const app = createApp(App)
app
    .component('ma-pagination', MaPagination)
    .use(router)
    .mount('#app')
