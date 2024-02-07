<script setup>
import {ref} from "vue";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import MaModal from "@/components/UI/MaModal.vue";
import router from "@/router/router";

const email = ref('')
const isOpen = ref(false)
const auth = getAuth()

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

    }
}
</script>

<template>
    <div class="block__page">
        <form @submit.prevent class="form">
            <h2>Reset password</h2>
            <p>Enter your email address</p>
            <ma-input v-model="email" placeholder="Email"></ma-input>
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
    margin-top: 300px;
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
}

input {
    width: 70%;
    border-radius: 0%;
    border: none;
    border-bottom: 1px solid #b8860b;
}

input:focus {
    outline: none;
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
</style>