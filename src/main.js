import {createApp} from 'vue'
import App from './App.vue'
import router from './router/router'
import MaPagination from "@/components/UI/MaPagination.vue";
import MaInput from "@/components/UI/MaInput.vue";
import MaMultiSelect from "@/components/UI/MaMultiSelect.vue";
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import MaModal from "@/components/UI/MaModal.vue";

const app = createApp(App)

const firebaseConfig = {
    apiKey: "AIzaSyD7v2D6JqoaOmWIefdBxlBA98YlHO82ADU",
    authDomain: "movies-app-fa38f.firebaseapp.com",
    databaseURL: "https://movies-app-fa38f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "movies-app-fa38f",
    storageBucket: "movies-app-fa38f.appspot.com",
    messagingSenderId: "300372748855",
    appId: "1:300372748855:web:fe51b9906c3a889eb06db2",
    measurementId: "G-6R0BLC7PK0"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)

app
    .component('ma-modal', MaModal)
    .component('ma-multi-select', MaMultiSelect)
    .component('ma-input', MaInput)
    .component('ma-pagination', MaPagination)
    .use(router)
    .mount('#app')