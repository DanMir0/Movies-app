<script setup>
import MaInput from "@/components/UI/MaInput.vue";
import {ref} from "vue";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import router from "@/router/router";

const auth = getAuth();
const email = ref('')
const password = ref('')
const user = ref([])
const tokenResponse = ref([])
const login = async () => {
    try {
        let response = await signInWithEmailAndPassword(auth, email.value, password.value)
        user.value = response.user
        tokenResponse.value = response._tokenResponse
        router.push({name: 'FilterPage'})
    } catch (e) {

    }
}
</script>

<template>
    <div class="block__page">
        <form @submit.prevent class="form">
            <h2>Sign-in</h2>
            <div class="group__input">
                <ma-input v-model="email" placeholder="Email"></ma-input>
                <ma-input v-model="password" placeholder="Password"></ma-input>
                <p>Forgot password?</p>
            </div>
            <button class="button" @click="login">Sign in</button>
            <p class="sign-up">Don't have an account?</p>
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

.group__input p {
    margin-left: auto;
}

.sign-up {
    margin-top: 30px;
}
</style>