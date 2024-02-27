<script setup>
import {signOut} from "firebase/auth"
import {onMounted, ref} from "vue";
import router from "@/router/router";
import useUser from "@/composable/useUser";
import MaSelectCountry from "@/components/UI/MaSelectCountry.vue";
import MaToast from "@/components/UI/MaToast.vue";

const showToastMessage = ref(false);
const toastMessage = ref("")
const typeToast = ref('')

function showToast(message, type) {
    toastMessage.value = message
    showToastMessage.value = true;
    typeToast.value = type
}

const {
    savePassword,
    checkUsernameExists,
    saveInfoUser,
    user,
    auth,
    updateUsername,
    sendVerification,
    resetPassword
} = useUser()

const email = ref('')
const username = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const currentPassword = ref('')
const isVerification = ref(false)
const country = ref('')
const sex = ref('')
const dateOfBirth = ref('')
const userSignOut = () => {
    signOut(auth)
    router.push('/')
}

const usernameError = ref('')
const showUsernameError = ref(false)
const confirmPasswordError = ref('')
const showConfirmPasswordError = ref(false)
const newPasswordError = ref('')
const showNewPasswordError = ref(false)
const currentPasswordError = ref('')
const showCurrentPasswordError = ref(false)
const saveProfile = async () => {
    try {
        if (username.value !== '' && username.value !== user.value.displayName) {
            let isThereUsername = await checkUsernameExists(username)
            if (isThereUsername) {
                usernameError.value = 'The user already exists with this username.'
                showUsernameError.value = true;
            }
            await updateUsername(username.value)
            showUsernameError.value = false
            showToast('Username changed!', 'success')
        } else if (confirmPassword.value !== '' && newPassword.value !== '' && currentPassword.value !== '') {
            if (newPassword.value === '' || newPassword.value.length < 6) {
                newPasswordError.value = 'Password must be non-blank and more than 6 characters long'
                showNewPasswordError.value = true
            } else if (confirmPassword.value !== newPassword.value) {
                confirmPasswordError.value = 'The passwords don\'t match'
                showConfirmPasswordError.value = true
            } else if (confirmPassword.value === '') {
                confirmPasswordError.value = 'The field must not be empty'
                showConfirmPasswordError.value = true
            } else if (currentPassword.value === '') {
                currentPasswordError.value = 'The field must not be empty'
                showCurrentPasswordError.value = true
            } else {
                showConfirmPasswordError.value = false
                showNewPasswordError.value = false
                showCurrentPasswordError.value = false
                await savePassword(currentPassword.value, newPassword.value)
                showToast('Password changed!', 'success')
                confirmPassword.value = ''
                newPassword.value = ''
                currentPassword.value = ''
            }
        } else {
            await saveInfoUser(sex.value, country.value, dateOfBirth.value)
            showToast('Changed!', 'success')
        }
    } catch (error) {
        showToast(error, 'error')
    }
}

const onSendVerification = async () => {
    try {
        await sendVerification
        showToast('Check your email!', 'success')
    } catch (e) {
        showToast(e, 'error')
    }
}

const onResetPassword = async () => {
    try {
        await resetPassword(email.value)
        showToast('Check your email!', 'success')
    } catch (e) {
        showToast(e, 'error')
    }
}

onMounted(async () => {
    email.value = user.value.email
    username.value = user.value.displayName
    isVerification.value = user.value.emailVerified
    sex.value = user.value.sex
    country.value = user.value.country
    dateOfBirth.value = user.value.dateOfBirth
})
</script>

<template>
    <div class="user__page">
        <form class="user__setting" @submit.prevent>
            <div class="setting__item">
                <label class="label__setting" for="userEmail">Email</label>
                <ma-input
                    class="email"
                    v-model="email"
                    id="userEmail"
                    placeholder="Email..."
                    readonly
                />
                <img v-if="!isVerification" src="@/icons/not-found.svg" @click="onSendVerification"
                     class="icon icon__verif" alt="Email not verify"/>
                <img v-else src="@/icons/not-found.svg" class="icon" alt="Email is verify"/>
                <span class="help">If you change your email, a confirmation email will be sent to you.</span>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="userName">Your username</label>
                <ma-input
                    v-model="username"
                    id="userName"
                    placeholder="Username..."
                    :class="{'error': showUsernameError}"
                >
                </ma-input>
                <span v-if="!showUsernameError" class="help">Name to be displayed.</span>
                <div v-else class="error-message">{{ usernameError }}</div>
            </div>
            <p class="label__info-user">Provide information about yourself (optional)</p>
            <div class="setting__item setting__sex">
                <p class="label__setting">Identify yourself</p>
                <div class="group__info">
                    <div class="group__sex">
                        <div class="sex__item">
                            <input type="radio" id="man" value="man" v-model="sex"/>
                            <label class="label__gender" for="man">Man</label>
                        </div>
                        <div class="sex__item">
                            <input type="radio" id="women" value="women" v-model="sex"/>
                            <label class="label__gender" for="women">Women</label>
                        </div>
                    </div>
                    <input type="date" v-model="dateOfBirth" placeholder="Date of birthay..."/>
                </div>
            </div>
            <div class="setting__item">
                <ma-select-country v-model="country"></ma-select-country>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="currentPassword">Current password</label>
                <ma-input
                    v-model="currentPassword"
                    id="currentPassword"
                    placeholder="Current password..."
                    :class="{'error': showCurrentPasswordError}"
                >
                </ma-input>
                <div v-if="!showCurrentPasswordError" class="group__password">
                    <span class="help">Enter the current password if you want change the password.</span>
                    <a class="btn__forgot-password" href="#" @click="onResetPassword">Forgot password?</a>
                </div>
                <div v-else class="error-message">{{ currentPasswordError }} <a class="btn__forgot-password" href="#"
                                                                                @click="handleResetPassword">Forgot
                    password?</a></div>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="newPassword">New password</label>
                <ma-input
                    v-model="newPassword"
                    id="newPassword"
                    placeholder="New password..."
                    :class="{'error': showNewPasswordError}"
                >
                </ma-input>
                <span v-if="!showNewPasswordError" class="help">If you do not need to change the password, leave the field blank.</span>
                <div v-else class="error-message">{{ newPasswordError }}</div>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="confirmPassword">Repeat new password</label>
                <ma-input
                    v-model="confirmPassword"
                    id="confirmPassword"
                    placeholder="Repeat password..."
                    :class="{'error': showConfirmPasswordError}"
                >
                </ma-input>
                <span v-if="!showConfirmPasswordError" class="help">If you do not need to change the password, leave the field blank.</span>
                <div v-else class="error-message">{{ confirmPasswordError }}</div>
            </div>
            <div class="group__btn">
                <ma-button @click="userSignOut">SignOut</ma-button>
                <ma-button @click="saveProfile">Save</ma-button>
            </div>
        </form>
    </div>
    <MaToast :type="typeToast" :message="toastMessage" v-if="showToastMessage" @close="showToastMessage = false"/>
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
    max-width: 530px;
    width: 100%;
}

.setting__item {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
}

.label__setting {
    margin-left: 17px;
}

.help {
    margin-left: 17px;
    color: #999999;
}

.icon {
    background-color: transparent;
    font-size: 12px;
    position: absolute;
    top: 43%;
    transform: translateY(-12%);
    right: 4%;
}

.icon__verif:hover {
    opacity: 0.8;
    cursor: pointer;
}

#userEmail {
    color: #7E7E7E;
}

.group__info {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.group__btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.group__password {
    display: flex;
    flex-direction: row;
}

.btn__forgot-password {
    padding: 0;
    background-color: transparent;
}

.btn__forgot-password:hover {
    background-color: transparent;
    opacity: 0.8;
}

.label__gender {
    margin-left: 5px;
}

.group__sex {
    display: flex;
    gap: 20px;
    margin-left: 17px;
}

.sex__item {
    display: flex;
    align-items: center;
}

.label__info-user {
    text-align: center;
}

.setting__sex {
    align-items: center;
    gap: 10px;
}

input[type="date"] {
    width: 220px;
    background-color: #424242;
    padding: 15px;
    font-family: "Roboto Mono", monospace;
    color: #ffffff;
    font-size: 18px;
    border: none;
    outline: none;
    border-radius: 5px;
}

::-webkit-calendar-picker-indicator {
    background-color: #ffffff;
    padding: 5px;
    cursor: pointer;
    border-radius: 3px;
}

.error-message {
    margin-left: 17px;
    color: #ff0000;
}

.error {
    border: 1px solid #ff0000;
}
</style>