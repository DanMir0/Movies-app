<script setup>
import {signOut} from "firebase/auth"
import {onMounted, ref} from "vue";
import router from "@/router/router";
import useUser from "@/composable/useUser";
import MaModal from "@/components/UI/MaModal.vue";

const isShowModal = ref(false)
const errorMsg = ref('')
const openModal = (message) => {
    isShowModal.value = true
    errorMsg.value = message
}

const {addProfile, auth, sendVerification, getCurrentUser} = useUser(openModal)

const email = ref()
const username = ref()
const password = ref('')
const confirmPassword = ref('')
const isVerification = ref(false)


const userSignOut = () => {
    signOut(auth)
    router.push('/')
}

const saveProfile = () => {
    if (password.value !== confirmPassword.value) {
        isShowModal.value = true
        errorMsg.value = 'The passwords don\'t match.'
    } else if (password.value === '' && confirmPassword.value === '') {
        isShowModal.value = true
        errorMsg.value = 'Please enter the password.'
    } else {
        try {
            addProfile(email.value, username.value, password.value)
        } catch (e) {
            openModal(e.message)
        }

    }
}

onMounted(async () => {
    let user = await getCurrentUser()
    email.value = user.email
    username.value = user.displayName
    isVerification.value = user.emailVerified
})
</script>

<template>
    <div class="user__page">
        <h2>Profile</h2>
        <form class="user__setting" @submit.prevent>
            <div class="setting__item">
                <label for="userEmail">Email</label>
                <ma-input
                    v-model="email"
                    id="userEmail"
                    placeholder="Email..."
                >
                    <template #icon>
                        <span v-show="!isVerification" class="icon" @click="sendVerification">verifity</span>
                        <span v-show="isVerification" class="icon">
                            <svg width="15px" height="15px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#ffffff"
                                      d="M77.248 415.04a64 64 0 0 1 90.496 0l226.304 226.304L846.528 188.8a64 64 0 1 1 90.56 90.496l-543.04 543.04-316.8-316.8a64 64 0 0 1 0-90.496z"/>
                            </svg>
                        </span>
                    </template>
                </ma-input>
                <span class="help">If you change your email, a confirmation email will be sent to you.</span>
            </div>
            <div class="setting__item">
                <label for="userName">Your username</label>
                <ma-input
                    v-model="username"
                    id="userName"
                    placeholder="Username..."
                >
                </ma-input>
                <span class="help">Name to be displayed.</span>
            </div>
            <div class="setting__item">
                <label for="userPassword">New password (not necessarily)</label>
                <ma-input
                    v-model="password"
                    id="userPassword"
                    placeholder="Password..."
                >
                </ma-input>
                <span class="help">If you do not need to change the password, leave the field blank.</span>
            </div>
            <div class="setting__item">
                <label for="userConfPassword">Repeat password (not necessarily)</label>
                <ma-input
                    v-model="confirmPassword"
                    id="userConfPassword"
                    placeholder="Repeat password...">
                </ma-input>
                <span class="help">If you do not need to change the password, leave the field blank.</span>
            </div>
            <button @click="saveProfile()">Save</button>
            <button @click="userSignOut">SignOut</button>
        </form>
    </div>
    <ma-modal @close="isShowModal =! isShowModal" v-show="isShowModal"><p>{{ errorMsg }}</p></ma-modal>
</template>

<style scoped>
.user__page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user__setting {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.setting__item {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

label {
    margin-left: 17px;
}

.help {
    margin-left: 17px;
    color: #999999;
}

button {
    padding: 0.7em 1em;
    background-color: #303030;
    border: none;
    max-width: 108px;
    width: 100%;
}

button:hover {
    background-color: #3e3e3e;
    cursor: pointer;
}

.icon {
    background-color: transparent;
    font-size: 12px;
    position: absolute;
    top: 38%;
    transform: translateY(-12%);
    right: 5%;
}

.icon__verifity:hover {
    opacity: 0.8;
    cursor: pointer;
}

</style>