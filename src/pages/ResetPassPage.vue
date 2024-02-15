<script setup>
import {ref} from "vue";
import router from "@/router/router";
import useUser from "@/composable/useUser";

const {auth, resetPassword} = useUser()
const email = ref('')
const isOpen = ref(false)
const isError = ref(false)
const error = ref('')
const closeModal = () => {
    isOpen.value = !isOpen.value
    router.push({name: 'LoginPage'})
}

const handlerResetPassword = async () => {
    try {
        await resetPassword(email.value)
        isOpen.value = true
    } catch (e) {
        isError.value = true
        error.value = e
        console.log(error.value, isError.value)
    }
}
</script>

<template>
    <ma-container>
            <ma-form>
                <h2>Reset password</h2>
                <p>Enter your email address</p>
                <div class="group__input">
                    <ma-input type="email" v-model="email" placeholder="Email" autocomplete="email"></ma-input>
                    <span class="icon">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                              fill="#ffffff"/>
                    </svg>
                </span>
                </div>
                <p class="error" v-if="isError">{{ error }}</p>
                <ma-button @click="handlerResetPassword">Continue</ma-button>
                <p class="sign-in">Already Signing Up?
                    <router-link :to="{name: 'LoginPage'}">Login</router-link>
                </p>
            </ma-form>
            <ma-modal v-show="isOpen" :open="isOpen" @close="closeModal">
                <h2 class="modal__msg">We have sent a password reset to your email address.</h2>
            </ma-modal>
    </ma-container>
</template>

<style scoped>
.group__input {
    width: 100%;
    position: relative;
}

.icon {
    position: absolute;
    right: 16px;
    top: 8px;
}

a {
    text-decoration: underline;
}

a:hover {
    color: #b8860b;
}

.error {
    color: #ff0000;
}
</style>