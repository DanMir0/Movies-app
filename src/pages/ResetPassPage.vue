<script setup>
import {ref} from "vue";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import MaModal from "@/components/UI/MaModal.vue";
import router from "@/router/router";


const email = ref('')
const isOpen = ref(false)
const auth = getAuth()
const isError = ref(false)
const error = ref('')
const closeModal = () => {
    isOpen.value = !isOpen.value
    router.push({name: 'LoginPage'})
}
const resetPassword = async () => {
    try {
        const response = await sendPasswordResetEmail(auth, email.value)
        console.log(response)
        isOpen.value = true
    } catch (e) {
        isError.value = true
        if (e.code === 'auth/missing-email') {
            error.value = 'Enter the valid email.'
        } else {
            console.log(e)
        }
    }
}
</script>

<template>
    <div class="block__page">
        <form @submit.prevent class="form" :class="{'form__error': isError}">
            <h2>Reset password</h2>
            <p>Enter your email address</p>
            <div class="group__input">
                <ma-input type="email" v-model="email" placeholder="Email"></ma-input>
                <span class="icon">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                              fill="#ffffff"/>
                    </svg>
                </span>
            </div>
            <p class="error" v-show="isError">{{ error }}</p>
            <button class="button" @click="resetPassword">Continue</button>
            <p class="sign-in">Already Signing Up?
                <router-link :to="{name: 'LoginPage'}">Login</router-link>
            </p>
        </form>
        <ma-modal v-show="isOpen" :open="isOpen" @close="closeModal">
            <h2 class="modal__msg">We have sent a password reset to your email address.</h2>
        </ma-modal>
    </div>
</template>

<style scoped>
.block__page {
    margin-top: 200px;
    display: flex;
    justify-content: center;
}

.form {
    padding: 50px 0;
    max-width: 40%;
    width: 100%;
    border: 1px solid #b8860b;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    border-radius: 1.5rem;
}

input {
    width: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #b8860b;
}

input:focus {
    outline: none;
    padding: 15px 0;
    width: calc(100% + 20px); /* увеличьте на 20px для отступов влево и вправо */
    margin-left: -10px; /* отрицательный отступ влево */
    margin-right: -10px; /* отрицательный отступ вправо */
}

.button {
    padding: 10px;
    background: #b8860b;
    border: none;
    max-width: 130px;
    width: 100%;
}

.button:hover {
    opacity: 0.9;
}

.sign-in {
    margin-top: 30px;
}

.modal__msg {
    background: transparent;
    color: #000000;
}

a {
    text-decoration: none;
}

a:hover {
    opacity: 0.8;
}

.error {
    color: #ff0000;
    text-align: center;
    margin-bottom: 15px;
}

.form__error {
    border: 1px solid #ff0000;
}

.group__input {
    position: relative;
    width: 75%;
}

.icon {
    position: absolute;
    top: 50%;
    right: 10px; /* Установите отступ справа для положения иконки */
    transform: translateY(-50%);
    pointer-events: none; /* Иконка не взаимодействует с событиями мыши */
}

input:focus + .icon {
    right: -5px; /* При фокусе сместить иконку вправо */
}
</style>