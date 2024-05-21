<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import useUser from "@/composable/useUser";
import {signOut} from "firebase/auth";
import router from "@/router/router";

const searchQuery = ref('')
const {getCurrentUser, auth, user} = useUser()
const userPhoto = ref(null)
const displayName = ref(null)

onMounted(async () => {
    await getCurrentUser()
    console.log(user)
    userPhoto.value = user.value.photoURL
    displayName.value = user.value.displayName
})

const userSignOut = () => {
    signOut(auth)
    showBurger.value = false
}

const showDropdown = ref(false)
const handleClickOutside = (event) => {
    if (user.value.uid) {
        const dropdown = document.querySelector('.dropdown');
        const profileButton = document.querySelector('.dropdown__open');
        if (!dropdown.contains(event.target) && !profileButton.contains(event.target)) {
            showDropdown.value = false;
        }
    }
};

function toggleDropdown() {
    showDropdown.value = !showDropdown.value
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const showBurger = ref(false)
const searchExpanded = ref(false)

const expandSearch = () => {
    searchExpanded.value = !searchExpanded.value
    if (!searchExpanded.value) {
        searchQuery.value = ''
    }
}

watch(() => user.value.photoURL, (newPhotoURL) => {
    userPhoto.value = newPhotoURL
})

watch(() => user.value.displayName, (newDisplayName) => {
    displayName.value = newDisplayName
})
</script>

<template>
    <header class="navbar">
        <router-link :to="{name: 'FilterPage'}" class="logo link">
            <img class="logo__img" src="@/icons/logo.svg" alt="logo">
            <div>
                <h1 class="allison-regular">CineSphere</h1>
                <hr>
                <h2>Watch for Free</h2>
            </div>
        </router-link>
                <div class="menu">
                    <router-link class="link" :to="{name: 'FilterPage'}">Movies</router-link>
                </div>
        <div class="mobile" :style="{position: searchExpanded ? 'absolute': 'relative', width: searchExpanded ? '100%' : '20%'}">
            <div class="search">
                <span class="search__icon search__icon-back" @click="searchExpanded = false"
                      :class="{'search__icon--active': searchExpanded}"
                      :style="{display: searchExpanded ? 'block' : 'none'}"></span>
                <ma-input
                    v-show="searchExpanded"
                    class="search__input"
                    :class="{'search__input--active': searchExpanded}"
                    v-model="searchQuery"
                    @keyup.enter="$emit('update:searchQuery', $event.target.value)"
                    @keydown.enter="router.push({ name: 'SearchPage', query: { q: searchQuery } })"
                    placeholder="Search..."
                />
                <span class="search__icon"
                      :class="{'search__icon--active': searchExpanded}"
                      :style="{ right: searchExpanded ? '45px' : '4px', display: showBurger ? 'none' : 'block' }"
                      @click="expandSearch"></span>
            </div>
            <div class="hamburger"
            :style="{display: searchExpanded ? 'none' : 'block'}">
                <div class="hamburger__icon" @click="showBurger = !showBurger"
                     :class="{'hamburger--active': showBurger === true, 'hamburger--no-active': showBurger === false}"
                     :style="{'z-index': showBurger ? 10 : 2}"
                ></div>
                <div v-show="showBurger" class="hamburger__content">
                    <ul class="hamburger__lists">
                        <li class="hamburger__item">
                            <span class="link__icon link__icon-movies"></span>
                            <router-link @click="showBurger = false" :to="{name: 'FilterPage'}">Movies</router-link>
                        </li>
                        <li v-if="user.uid" class="hamburger__item">
                            <span class="link__icon link__icon-profile"></span>
                            <router-link @click="showBurger = false" :to="{name: 'ProfilePage'}">Profile</router-link>
                        </li>
                        <li v-if="user.uid" class="hamburger__item">
                            <span class="link__icon link__icon-favorite"></span>
                            <router-link @click="showBurger = false" :to="{name: 'FavoritesPage'}">Favorites
                            </router-link>
                        </li>
                        <li v-if="user.uid" class="dropdown__list">
                            <span class="link__icon link__icon-exit"></span>
                            <router-link @click="userSignOut" to="/">Sign Out</router-link>
                        </li>
                    </ul>
                    <div class="block__entry" v-if="!user.uid">
                        <router-link class="link" :to="{name: 'LoginPage'}">Sign In</router-link>
                        <router-link class="link" :to="{name: 'RegistrationPage'}">Sign Up</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="tablet">
            <div class="search">
                <ma-input
                    class="search__input"
                    v-model="searchQuery"
                    @keyup.enter="$emit('update:searchQuery', $event.target.value)"
                    @keydown.enter="router.push({ name: 'SearchPage', query: { q: searchQuery } })"
                    placeholder="Search..."
                />
                <span class="search__icon"
                      @click="expandSearch"></span>
            </div>
        </div>
        <div v-if="user.uid" class="dropdown">
            <div class="navbar__profile"  @click="toggleDropdown">
                <img class="photo" :src="userPhoto">
                <p>{{displayName}}</p>
            </div>
            <div v-show="showDropdown" class="dropdown__open">
                <ul class="dropdown__lists">
                    <li class="dropdown__list">
                        <img class="dropdown__icon" src="@/icons/profile.svg">
                        <router-link :to="{name: 'ProfilePage'}">Profile</router-link>
                    </li>
                    <li class="dropdown__list">
                        <img class="dropdown__icon" src="@/icons/favorite.svg">
                        <router-link :to="{name: 'FavoritesPage'}">Favorites</router-link>
                    </li>
                    <li class="dropdown__list">
                        <img class="dropdown__icon" src="@/icons/exit.svg">
                        <router-link @click="userSignOut" to="/">Sign Out</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="block__entry block__entry--desk" v-else>
            <router-link class="link" :to="{name: 'LoginPage'}">Sign In</router-link>
            <router-link class="link" :to="{name: 'RegistrationPage'}">Sign Up</router-link>
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

.photo {
    width: 30px;
    border-radius: 50%;
}

.tablet {
    max-width: 420px;
    width: 100%;
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

.link {
    text-decoration: none;
}

.menu a {
    font-size: 25px;
}

.menu a:hover {
    color: #b8860b;
}

.search {
    max-width: 420px;
    width: 100%;
    position: relative;
}

.search__input {
    width: 100%;
    padding-right: 30px;
}

.search__icon {
    background-image: url("/src/icons/search.svg");
    width: 25px;
    height: 25px;
    position: absolute;
    top: 52%;
    right: 15px;
    transform: translateY(-50%);
    pointer-events: none; /*Иконка не взаимодействует с событиями мыши */
}

.logo__img {
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

.dropdown {
    position: relative;
}

.dropdown__open {
    width: 120px;
    right: 0;
    position: absolute;
    border: 1px solid #424242;
    box-shadow: 0px 4px 6px 2px #090909;
    background-color: #0f0f0f;
    padding: 15px;
}

.dropdown__lists {
    color: #ffffff;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.dropdown__icon {
    width: 20px;
}

.dropdown__list {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mobile {
    display: none;
}

.navbar__profile {
    display: flex;
    align-items: center;
    gap: 10px;
}

@media screen and (max-width: 1024px) {
    .mobile {
        display: none;
    }

    .tablet {
        max-width: 300px;
        width: 100%;
    }

    .search {
        max-width: 100%;
    }

    .navbar {
        padding: 10px;
        margin-bottom: 20px;
        gap: 5px;
    }

    .logo__img {
        width: 80px;
    }

    h1 {
        font-size: 40px;
    }

    h2 {
        font-size: 18px;
    }

    .menu a {
        font-size: 18px;
    }

    .hamburger {
        display: none;
    }
}

@media screen and (max-width: 770px) {
    .mobile {
        display: flex;
    }

    .tablet {
        display: none;
    }

    .menu {
        display: none;
    }

    .navbar {
        position: relative;
    }

    .dropdown {
        display: none;
    }

    .logo__img {
        width: 60px;
    }

    h1 {
        font-size: 25px;
    }

    h2 {
        font-size: 15px;
    }

    .hamburger {
        display: block;
        position: relative;
    }

    .hamburger__icon {
        width: 30px;
        height: 30px;
    }

    .hamburger--no-active {
        background-image: url("/src/icons/menu.svg");
    }

    .hamburger--active {
        left: -30px;
        background-color: transparent;
        position: absolute;
        z-index: 3;
        background-image: url("/src/icons/close.svg");
    }

    .hamburger__content {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        z-index: 7;
        flex-direction: column; /* Добавлено */
        justify-content: center; /* Добавлено */
        align-items: center; /* Добавлено */
    }

    .hamburger__lists {
        list-style: none;
        display: flex;
        gap: 10px;
        flex-direction: column;
    }

    .hamburger__item {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .hamburger__item:active {
        color: #b8860b;
    }

    .link {
        background-color: transparent;
    }

    .link__icon {
        display: inline-block;
        background-size: cover;
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
    }

    .link__icon-movies {
        background-image: url("/src/icons/movies.svg");
    }

    .link__icon-profile {
        background-image: url("/src/icons/profile.svg");
    }

    .link__icon-favorite {
        background-image: url("/src/icons/favorite.svg");
    }

    .link__icon-exit {
        background-image: url("/src/icons/exit.svg");
    }

    .block__entry {
        margin-top: 10px;
        flex-direction: column;
    }

    .block__entry--desk {
        display: none;
    }

    .search {
        display: block;
        z-index: 5;
    }

    .search__icon {
        top: 15px;
        right: 4px;
        transition: right 0.3s ease;
        pointer-events: fill;
    }

    .search__icon--active {
        top: 24px;
    }

    .search__icon-back {

        left: 10px;
        background-image: url("/src/icons/arrow-back.svg");
        background-repeat: no-repeat;
        background-size: cover;
    }

    .search__input {
        width: 0;
        padding-right: 0;
        opacity: 0;
        transition: width 0.3s ease, opacity 0.3s ease, padding-right 0.3s ease;
    }

    .search__input--active {
        width: 95%;
        padding-right: 30px;
        padding-left: 40px;
        opacity: 1;
    }
}
</style>