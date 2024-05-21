<script setup>
import {onMounted, ref} from "vue";
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
    saveInfoUser,
    user,
    auth,
    updateUsername,
    sendVerification,
    resetPassword,
    savePhoto,
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
const photo = ref('')
let urlPhoto = ''


const errorNewPassword = ref('')
const errorConfirmPassword = ref('')
const errorCurrentPassword = ref('')
const errorUsername = ref('')

function isValidPassword() {
    if (!!currentPassword.value) {
        if (newPassword.value === '') {
            errorNewPassword.value = 'Field must not be empty.'
        } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(newPassword.value)) {
            errorNewPassword.value = 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
        } else {
            errorNewPassword.value = ''
        }
        if (confirmPassword.value === '') {
            errorConfirmPassword.value = 'Field must not be empty.'
        } else if (confirmPassword.value !== newPassword.value) {
            errorConfirmPassword.value = 'The passwords don\'t match.'
        } else {
            errorConfirmPassword.value = ''
        }
    }
    return true
}

const saveProfile = async () => {
    if (currentPassword.value !== '') {
        if (isValidPassword()) {
            try {
                await savePassword(currentPassword.value, newPassword.value)
                showToast('Password changed', 'success')

            } catch (error) {
                errorCurrentPassword.value = error
            }
        }
    } else if ((newPassword.value !== '' && currentPassword.value === '') || (confirmPassword.value !== '' && currentPassword.value === '')) {
        errorCurrentPassword.value = 'Field must not be empty.'
    }
    if ((username.value !== '' && username.value !== user.value.displayName)) {
        try {
            await updateUsername(username.value)
            showToast('Username changed', 'success')

        } catch (error) {
            errorUsername.value = error
        }
    } else if (username.value === '') {
        errorUsername.value = 'Field must not be empty.'
    }
    if (sex.value !== user.value.sex || country.value !== user.value.country || dateOfBirth.value !== user.value.dateOfBirth) {
        await saveInfoUser(sex.value, country.value, dateOfBirth.value)
        showToast('Changed!', 'success')
    }
    if (urlPhoto) {
        await savePhoto(urlPhoto)
        showToast('Changed!', 'success')
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
    photo.value = user.value.photoURL
})

const changeImage = (e) => {
    urlPhoto = e.target.files[0];
    if (urlPhoto) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imgElement = document.querySelector('.img-c');
            if (imgElement) {
                imgElement.src = event.target.result;
            }
        };
        reader.readAsDataURL(urlPhoto);
    }
}
</script>

<template>
    <div class="user__page">
        <div class="user__photo">
            <img class="img-c" :src="photo" alt="profile image">
            <label class="upload-img" for="input-file">Choose file</label>
            <input id="input-file" type="file" accept="image/jpeg, image/png, image/jpg" @change="changeImage">
        </div>

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
                <span v-if="!isVerification" class="icon icon__no-verify" @click="onSendVerification"></span>
                <span v-else class="icon icon-verify"></span>
                <span class="help">If you change your email, a confirmation email will be sent to you.</span>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="userName">Your username</label>
                <ma-input
                    v-model="username"
                    id="userName"
                    placeholder="Username..."
                    :isError="!!errorUsername"
                >
                </ma-input>
                <span class="error-message" v-if="!!errorUsername">{{ errorUsername }}</span>
                <span class="help">Name to be displayed.</span>
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
                    :isError="!!errorCurrentPassword"
                >
                </ma-input>
                <span class="error-message" v-if="!!errorCurrentPassword">{{ errorCurrentPassword }}</span>
                <div class="group__password">
                    <span class="help">Enter the current password if you want change the password.</span>
                    <a class="btn__forgot-password" href="#" @click="onResetPassword">Forgot password?</a>
                </div>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="newPassword">New password</label>
                <ma-input
                    v-model="newPassword"
                    id="newPassword"
                    placeholder="New password..."
                    :isError="!!errorNewPassword"
                >
                </ma-input>
                <span class="error-message" v-if="!!errorNewPassword">{{ errorNewPassword }}</span>
                <span class="help">If you do not need to change the password, leave the field blank.</span>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="confirmPassword">Repeat new password</label>
                <ma-input
                    v-model="confirmPassword"
                    id="confirmPassword"
                    placeholder="Repeat password..."
                    :isError="!!errorConfirmPassword"
                >
                </ma-input>
                <span class="error-message" v-if="!!errorConfirmPassword">{{ errorConfirmPassword }}</span>
                <span class="help">If you do not need to change the password, leave the field blank.</span>
            </div>
            <ma-button class="btn" @click="saveProfile">Save</ma-button>
        </form>
    </div>
    <MaToast :type="typeToast" :message="toastMessage" v-if="showToastMessage" @close="showToastMessage = false"/>
</template>

<style scoped>
.error-message {
    margin-left: 17px;
    color: #ff0000;
}

.user__photo {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

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
    padding: 15px;
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
    position: absolute;
    top: 37px;
    right: 22px;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-size: cover;
}

.icon__no-verify {
    background-image: url("/src/icons/not-found.svg");
}

.icon__no-verify:hover {
    opacity: 0.8;
    cursor: pointer;
}

.icon-verify {
    background-image: url("/src/icons/complete.svg");
}

#userEmail {
    position: relative;
    color: #7E7E7E;
}

.group__info {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 10px;
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

.btn {
    border-radius: 28px;
    width: 25%;
}

.img-c {
    width: 180px;
    height: 180px;
    border-radius: 50%;
}

.upload-img {
    border-radius: 28px;
    text-align: center;
    padding: 0.7em 2em;
    background-color: #303030;
    border: none;
}

.upload-img:hover {
    background-color: #3e3e3e;
    cursor: pointer;
}

input[type='file'] {
    display: none;
}

@media screen and(max-width: 1024px) {
    .user__setting {
        gap: 20px;
        max-width: 500px;
    }
}

@media screen and(max-width: 375px) {
    .user__setting {
        gap: 15px;
    }
}
</style>