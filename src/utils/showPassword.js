import {computed, ref} from "vue";

const showPassword = ref(false);
let passwordIcon = ref(false)
const isShowPassword = computed(() => {
    return showPassword.value ? 'text' : 'password';
});

const togglePasswordVisibility = () => {
    passwordIcon.value = !passwordIcon.value
    return showPassword.value = !showPassword.value;
};

export {isShowPassword, togglePasswordVisibility, passwordIcon};