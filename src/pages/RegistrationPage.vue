<script setup>
import MaInput from "@/components/UI/MaInput.vue";
import {ref} from "vue";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import router from "@/router/router";

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const tokenResponse = ref([])

const auth = getAuth()
const user = auth.currentUser
const onSignUp = async () => {
    try {
        if (password.value !== confirmPassword.value) {

        }
        const response = await createUserWithEmailAndPassword(auth, email.value, password.value,)
        tokenResponse.value = response._tokenResponse
        await router.push({name: 'FilterPage'})
    } catch (e) {
        // позволяет вывести ошибку, пароль больше 6
    }


}

console.log(user)
</script>

<template>
    <div class="block__page">
        <form @submit.prevent class="form">
            <h2>Sign Up</h2>
            <div class="group__input">
                <ma-input v-model="email" placeholder="Email"></ma-input>
                <ma-input v-model="password" placeholder="Password"></ma-input>
                <ma-input v-model="confirmPassword" placeholder="Confirm password"></ma-input>
            </div>
            <button class="button" @click="onSignUp">Sign up</button>
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
    padding: 50px 0;
    max-width: 40%;
    width: 100%;
    border: 1px solid #b8860b;
    display: flex;
    flex-direction: column;
    align-items: center;
}

input {
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

.group__input {
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
</style>