<script setup>
import {ref} from "vue";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import router from "@/router/router";
import MaPasswordInput from "@/components/UI/MaPasswordInput.vue";

const auth = getAuth();
const email = ref('')
const password = ref('')
const error = ref('')
const isError = ref(false)

const login = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        await router.push({name: 'FilterPage'})
    } catch (e) {
        isError.value = true
        if (e.code === 'auth/invalid-email') {
            error.value = 'Enter a valid email address.'
        } else if (e.code === 'auth/invalid-credential') {
            error.value = 'This user does not exist.'
        } else if (e.code === 'auth/missing-password') {
            error.value = 'Enter the password.'
        } else {
            error.value = 'An unexpected error occurred. Please try again.'
            console.log(e)
        }
    }
}
</script>

<template>
    <ma-container>
        <ma-form  :isError="isError">
            <h2>Sign In</h2>
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
                <div class="group__input">
                    <MaPasswordInput v-model="password"/>
                    <router-link class="forgot-pass" :to="{name: 'ResetPasswordPage'}">Forgot password?</router-link>
                </div>
            </div>
            <p class="error" v-show="isError">{{ error }}</p>
            <ma-button @click="login">Sign In</ma-button>
            <p class="sign-up">Don't have an account?
                <router-link :to="{name: 'RegistrationPage'}">Sign Up</router-link>
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

.forgot-pass {
    margin-left: 290px;
}

.error {
    color: #ff0000;
}
</style>