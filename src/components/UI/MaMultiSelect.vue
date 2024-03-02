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
                    <span @click="removeGenre(genre)">
                         <svg fill="#ffffff" width="15px" height="15px" viewBox="-3.5 0 19 19"
                              xmlns="http://www.w3.org/2000/svg"
                              class="cf-icon-svg">
                        <path
                            d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"/>
                    </svg>
                    </span>
                </div>
            </div>
            <span @click="toggleOptions" class="arrow">
                <svg fill="#ffffff" height="15px" width="15px" version="1.1" id="Layer_1"
                     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                     viewBox="0 0 511.787 511.787" xml:space="preserve">
                <g>
                    <g>
                        <path d="M508.667,125.707c-4.16-4.16-10.88-4.16-15.04,0L255.76,363.573L18,125.707c-4.267-4.053-10.987-3.947-15.04,0.213
                            c-3.947,4.16-3.947,10.667,0,14.827L248.293,386.08c4.16,4.16,10.88,4.16,15.04,0l245.333-245.333
                            C512.827,136.693,512.827,129.867,508.667,125.707z"/>
                    </g>
                </g>
                </svg>
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