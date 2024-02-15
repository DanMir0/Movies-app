<script setup>
import {onMounted, ref} from "vue";
import useUser from "@/composable/useUser";
import router from "@/router/router";

const searchQuery = ref('')
const {getCurrentUser, isAuth, getPhotoUser } = useUser()
const photo = ref(null)
const user = ref()
onMounted(async () => {
    user.value = await getCurrentUser()
    photo.value = await getPhotoUser()
})

</script>

<template>
    <header class="navbar">
        <router-link :to="{name: 'FilterPage'}" class="logo">
            <img src="@/icons/logo.svg">
            <div>
                <h1 class="allison-regular">CineSphere</h1>
                <hr>
                <h2>Watch for Free</h2>
            </div>
        </router-link>
        <div class="menu">
            <router-link :to="{name: 'FilterPage'}">Movies</router-link>
        </div>
        <div class="block__search">
            <ma-input
                class="search"
                v-model="searchQuery"
                @keyup.enter="$emit('update:searchQuery', $event.target.value)"
                @keydown.enter="router.push({ name: 'SearchPage', query: { q: searchQuery } })"
                placeholder="Search..."
            />
            <span class="search-icon">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                    stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
        </div>
        <div class="block__entry" v-show="!isAuth">
            <router-link :to="{name: 'LoginPage'}">Sign In</router-link>
            <router-link :to="{name: 'RegistrationPage'}">Sign Up</router-link>
        </div>
        <div v-show="isAuth">
            <router-link :to="{name: 'UserPage'}">
                <img alt="profile" class="photo-profile" :src="photo">
            </router-link>
        </div>

    </header>
    <ma-container>
        <router-view></router-view>
    </ma-container>
</template>

<style scoped>
.navbar {
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #424242;
    margin-bottom: 30px;
    gap: 15px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 20px;
}

h1 {
    font-size: 60px;
}

h2 {
    font-size: 25px;
    text-align: center;
}

h1,
h2 {
    color: #b8860b;
}

hr {
    border: none;
    background-color: #b8860b;
    color: #b8860b;
    height: 2px;
}

.allison-regular {
    font-family: "Allison", cursive;
    font-weight: 400;
    font-style: normal;
}

.menu a {
    font-size: 25px;
}

.menu a:hover {
    color: #b8860b;
}

.block__search {
    max-width: 360px;
    width: 100%;
    position: relative;
}

.search {
    width: 100%;
    padding-right: 30px;
}

.search-icon {
    position: absolute;
    top: 52%;
    right: 15px;
    transform: translateY(-50%);
    pointer-events: none; /*Иконка не взаимодействует с событиями мыши */
}

img {
    width: 150px;
}

.block__entry {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
}

.block__entry a {
    border: 1px solid #424242;
    padding: 10px;
    border-radius: 1rem;
}

.block__entry a:hover {
    opacity: 0.8;
}

.photo-profile {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.photo-profile:hover {
    opacity: 0.9;
}
</style>