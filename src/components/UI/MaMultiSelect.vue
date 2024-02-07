<script setup>
import {ref} from "vue";

const props = defineProps({
    genres: {
        type: Array,
        require: true
    }
})
const emit = defineEmits(['genreChange'])
const selectedGenres = ref([])
const showOptions = ref(false)
const addGenre = (index) => {
    const selectedGenre = props.genres[index]

    if (selectedGenres.value.includes(selectedGenre)) {
        selectedGenres.value = selectedGenres.value.filter(genre => genre !== selectedGenre)
    } else {
        selectedGenres.value.push(selectedGenre)
    }
    console.log(selectedGenres.value)
}

const removeGenre = (delGenre) => {
    selectedGenres.value = selectedGenres.value.filter(genre => genre !== delGenre)
    emit('genreChange', delGenre.id)
}

const handleGenreClick = (genre, index) => {
    addGenre(index)
    emit('genreChange', genre.id)
}
const toggleOptions = () => {
    if (showOptions.value) {
        showOptions.value = false
    } else {
        showOptions.value = true;
    }
    console.log()
};

</script>

<template>
    <div class="select">
        <div class="show-select-genres">
            <div class="group__select">
                <p v-if="selectedGenres.length === 0">Select genre...</p>
                <div
                    class="select-genre"
                    v-for="(genre,index) in selectedGenres"
                    :key="index"
                >
                    <span>{{ genre.name }}</span>
                    <LiCross @click="removeGenre(genre)"></LiCross>
                </div>
            </div>
            <span @click="toggleOptions" class="arrow">

        </span>
        </div>
        <div class="options" v-if="showOptions">
            <ul class="lists">
                <li
                    v-for="(genre,index) in genres"
                    :key="index"
                    :value="genre.id"
                    @click="handleGenreClick(genre, index)"
                    :class="{ 'selected': selectedGenres.includes(genre) }"
                >
                    {{ genre.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.select {
    max-width: 250px;
    width: 100%;
}

.show-select-genres {
    position: relative;
    display: flex;
    color: #f1f1f1;
    gap: 10px;
    padding: 10px;
    border: 1px solid #424242;
    border-radius: 8px;
}

.group__select {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 13px;
}

.select-genre {
    border: 1px solid;
    padding: 10px;
    border-radius: 20px;
    display: flex;
    gap: 5px;
    align-items: center;
}

.select-genre:hover {
    opacity: 0.8;
}

.options {
    max-width: 250px;
    width: 100%;
    position: absolute;
    padding: 15px;
    border: 1px solid #424242;
    font-size: 15px;
    border-radius: 8px;
    overflow: auto;
    height: 100px;
}

.lists {
    color: #FFFFFF;
    list-style: none;
}

.lists li:hover {
    background-color: #b8860b;
    font-size: 20px;
}

.selected {
    background-color: #b8860b;
}

.arrow {
    margin-left: auto;
}
</style>