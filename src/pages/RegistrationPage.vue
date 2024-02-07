<script setup>
import MaInput from "@/components/UI/MaInput.vue";
import {ref} from "vue";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import router from "@/router/router";
import { FeMail, ReLockPasswordLine  } from "@kalimahapps/vue-icons"

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isError = ref(false)
const tokenResponse = ref([])

const auth = getAuth()


const onSignUp = async () => {
    try {
        if (password.value !== confirmPassword.value) {
            isError.value = true
            error.value = 'The passwords don\'t match.'
        } else {
            const response = await createUserWithEmailAndPassword(auth, email.value, password.value,)
            tokenResponse.value = response._tokenResponse
            await router.push({name: 'FilterPage'})
        }
    } catch (e) {
        isError.value = true
        if (e.code) {
            if (e.code === 'auth/weak-password') {
                error.value = 'Password should be at least 6 characters.'
            } else if (e.code === 'auth/missing password') {
                error.value = 'Enter a password.'
            } else if (e.code === 'auth/invalid-email') {
                error.value = 'Email must contain an \'@\' and a domain. For example \'example@tv.tv\''
            } else {
                console.log(e.code)
            }
        } else {
            error.value = 'An unexpected error occurred. Please try again.'
            console.log(e)
        }
    }
}

</script>

<template>
    <div class="block__page">
        <form @submit.prevent class="form" :class="{'form__error': isError}">
            <h2>Sign Up</h2>
            <div class="group__blocks">
                <div class="group__input">
                    <ma-input type="email" v-model="email" placeholder="Email"></ma-input>
                    <span class="icon">
                        <FeMail></FeMail>
                    </span>
                </div>
                <div class="group__input">
                    <ma-input type="password" v-model="password" placeholder="Password"></ma-input>
                    <span class="icon">
                        <ReLockPasswordLine></ReLockPasswordLine>
                    </span>
                </div>
                <div class="group__input">
                    <ma-input type="password" v-model="confirmPassword" placeholder="Confirm password"></ma-input>
                    <span class="icon">
                        <ReLockPasswordLine></ReLockPasswordLine>
                    </span>
                </div>
            </div>
            <p class="error" v-show="isError">{{ error }}</p>
            <button class="button" @click="onSignUp">Sign Up</button>
            <p class="sign-in">Already Signing Up?
                <router-link :to="{name: 'LoginPage'}">Login</router-link>
            </p>
        </form>
    </div>
</template>

<style scoped>
.block__page {
    margin-top: 300px;
    display: flex;
    justify-content: center;
}

.form {
    padding: 50px 15px;
    max-width: 40%;
    width: 100%;
    border: 1px solid #b8860b;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 1.5rem;
}

input {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #b8860b;
    width: 100%;
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

.group__blocks {
    margin: 30px 0;
    display: flex;
    flex-direction: column;
    gap: 11px;
    width: 70%;
    justify-content: center;
}

.sign-in {
    margin-top: 30px;
}

.error {
    color: #ff0000;
    text-align: center;
    margin-bottom: 15px;
}

.form__error {
    border: 1px solid #ff0000;
}

a {
    text-decoration: none;
}

a:hover {
    opacity: 0.8;
}
.group__input {
    position: relative;
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