<script setup>
import {signOut} from "firebase/auth"
import {onMounted, ref} from "vue";
import router from "@/router/router";
import useUser from "@/composable/useUser";
import MaSelectCountry from "@/components/UI/MaSelectCountry.vue";

const isShowModal = ref(false)
const errorMsg = ref('')
const openModal = (message) => {
    isShowModal.value = true
    errorMsg.value = message
}

const {updateProfileUser, userProfile,updatePhoto, auth, sendVerification, getCurrentUser, resetPassword} = useUser()

const email = ref('')
const username = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const currentPassword = ref('')
const isVerification = ref(false)
const photoFile = ref()

const userSignOut = () => {
    signOut(auth)
    router.push('/')
}

const saveProfile = async () => {
    if (newPassword.value) {
        if (newPassword.value !== confirmPassword.value) {
            openModal('The passwords don\'t match.')
        } else if (newPassword.value === '' || confirmPassword.value === '' || currentPassword.value === '') {
            openModal('Passwords do not match or the current password is not specified.')
        } else {
            openModal('Try later.')
        }
    } else {
        try {
            updateProfileUser(
                username.value,
                currentPassword.value,
                newPassword.value,
                userProfile.value.sex,
                userProfile.value.country,
                userProfile.value.dateOfBirth)
            openModal('The data has been changed.')
        } catch (e) {
            openModal(e.message)
        }

    }
}

const handleResetPassword = async () => {
    try {
        await resetPassword(email.value)
        openModal('We have sent a password reset to your email address.')
    } catch (e) {
        openModal(e)
    }
}

const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    const photo = await updatePhoto(file)
    photoFile.value = photo
}

onMounted(async () => {
    let user = await getCurrentUser()
    email.value = user.email
    username.value = user.displayName
    isVerification.value = user.emailVerified
    photoFile.value = user.photoURL
})
</script>

<template>
    <div class="user__page">
        <form class="user__setting" @submit.prevent>
            <div class="setting__item">
                <img :src="photoFile" alt="Profile photo">
                <input @change="handlePhotoUpload" type="file" name="file" id="file" class="inputfile"/>
                <label for="file">Choose a file</label>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="userEmail">Email</label>
                <ma-input
                    class="email"
                    v-model="email"
                    id="userEmail"
                    placeholder="Email..."
                    readonly
                />
                <span v-show="!isVerification" class="icon icon__verif" @click="sendVerification()">verif</span>
                <span v-show="isVerification" class="icon">
                    <svg width="15px" height="15px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#ffffff"
                              d="M77.248 415.04a64 64 0 0 1 90.496 0l226.304 226.304L846.528 188.8a64 64 0 1 1 90.56 90.496l-543.04 543.04-316.8-316.8a64 64 0 0 1 0-90.496z"/>
                    </svg>
                </span>
                <span class="help">If you change your email, a confirmation email will be sent to you.</span>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="userName">Your username</label>
                <ma-input
                    v-model="username"
                    id="userName"
                    placeholder="Username..."
                >
                </ma-input>
                <span class="help">Name to be displayed.</span>
            </div>
            <div class="setting__item">
                <p class="label__setting">Provide information about yourself (optional)</p>
                <div class="setting__user-info">
                    <div class="group__sex">
                        <div class="sex__item">
                            <input type="radio" id="man" value="man" v-model="userProfile.sex"/>
                            <label class="label__gender" for="man">Man</label>
                        </div>
                        <div class="sex__item">
                            <input type="radio" id="women" value="women" v-model="userProfile.sex"/>
                            <label class="label__gender" for="women">Women</label>
                        </div>
                    </div>
                    <ma-select-country v-model="userProfile.country" class="select__item"></ma-select-country>
                    <ma-input type="date" v-model="userProfile.dateOfBirth" placeholder="Date of birthay..."></ma-input>
                </div>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="currentPassword">Current password</label>
                <ma-input
                    v-model="currentPassword"
                    id="currentPassword"
                    placeholder="Current password..."
                >
                </ma-input>
                <div class="group__password">
                    <span class="help">Enter the current password if you want change the password.</span>
                    <button class="btn__forgot-password" @click="handleResetPassword">Forgot password?</button>
                </div>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="newPassword">New password (not necessarily)</label>
                <ma-input
                    v-model="newPassword"
                    id="newPassword"
                    placeholder="New password..."
                >
                </ma-input>
                <span class="help">If you do not need to change the password, leave the field blank.</span>
            </div>
            <div class="setting__item">
                <label class="label__setting" for="confirmPassword">Repeat password (not necessarily)</label>
                <ma-input
                    v-model="confirmPassword"
                    id="confirmPassword"
                    placeholder="Repeat password...">
                </ma-input>
                <span class="help">If you do not need to change the password, leave the field blank.</span>
            </div>
            <div class="group__btn">
                <button @click="userSignOut">SignOut</button>
                <button @click="saveProfile">Save</button>
            </div>
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
    gap: 5px;
    flex-direction: column;
}

.sex__item {
    display: flex;
    align-items: center;
}

.setting__user-info {
    padding-left: 17px;
    display: flex;
    gap: 10px;
    width: 100%;
}

.select__item {
    max-width: 300px;
    border-radius: 28px;
    border: 1px solid #424242;
}

.inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.inputfile + label {
    margin: 10px auto;
    width: 120px;
    padding: 0.5rem 1rem;
    font-size: 16px;
    color: white;
    background-color: #303030;;
    display: inline-block;
}

.inputfile:focus + label,
.inputfile + label:hover {
    background-color: #3e3e3e;
    cursor: pointer;
}

img {
    width: 160px;
    border-radius: 50%;
    height: 140px;
    margin: 0 auto;
}
</style>