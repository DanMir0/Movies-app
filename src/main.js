import {createApp} from 'vue'
import App from './App.vue'
import router from './router/router'
import MaPagination from "@/components/UI/MaPagination.vue";
import MaInput from "@/components/UI/MaInput.vue";
import MaModal from "@/components/UI/MaModal.vue";
import MaContainer from "@/components/UI/MaContainer.vue";
import MaButton from "@/components/UI/MaButton.vue";
import MaForm from "@/components/UI/MaForm.vue";
import MaDropdown from "@/components/UI/MaDropdown.vue";
import MaLoader from "@/components/MaLoader.vue";

const app = createApp(App)

app
    .component('ma-form', MaForm)
    .component('ma-button', MaButton)
    .component('ma-container', MaContainer)
    .component('ma-modal', MaModal)
    .component('ma-input', MaInput)
    .component('ma-pagination', MaPagination)
    .component('ma-dropdown', MaDropdown)
    .component('ma-loader', MaLoader)
    .use(router)
    .mount('#app')