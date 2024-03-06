<script setup>
import {ref} from "vue";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import router from "@/router/router";
import MaPasswordInput from "@/components/UI/MaPasswordInput.vue";
import useUser from "@/composable/useUser";

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isError = ref(false)
const auth = getAuth()

const {signUp} = useUser()

const onSignUp = async () => {
    try {
        if (password.value !== confirmPassword.value) {
            isError.value = true
            error.value = 'The passwords don\'t match.'
        } else {
           await signUp(email.value, password.value)
            await router.push({name: 'FilterPage'})
        }
    } catch (e) {
        isError.value = true
        error.value = e.message
    }
}
</script>

<template>
    <ma-container>
        <ma-form>
            <h2>Sign Up</h2>
            <div class="group__blocks">
                <div class="group__input">
                    <ma-input type="email" v-model="email" placeholder="Email" autocomplete="email"></ma-input>
                    <span class="icon icon__email">
                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                                  fill="#ffffff"/>
                        </svg>
                    </span>
                </div>
                <MaPasswordInput v-model="password"/>
                <MaPasswordInput v-model="confirmPassword"/>
            </div>
            <p class="error" v-show="isError">{{ error }}</p>
            <ma-button class="button" @click="onSignUp">Sign Up</ma-button>
            <p class="sign-in">Already Signing Up?
                <router-link :to="{name: 'LoginPage'}">Login</router-link>
            </p>
        </ma-form>
    </ma-container>
</template>

<style scoped>
.group__blocks {
    width: 100%;
    display: flex;
    gap: 15px;
    flex-direction: column;
}

.group__input {
    position: relative;
}

.icon {
    position: absolute;
}

.icon__email {
    top: 9px;
    right: 18px;
}

.error {
    color: #ff0000;
}
</style>