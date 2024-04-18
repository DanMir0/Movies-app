<script setup>
import {computed} from "vue";

const props = defineProps({
    totalPages: Number,
    page: Number
})

const emit = defineEmits(['change'])

const displayedPages = computed(() => {
    const result = [];
    const displayPage = 5;
    const startPage = 1;
    let currentPage = props.page
    const endPage = props.totalPages

    if (endPage <= displayPage) {
        for (let i = startPage; i <= endPage; i++) {
            result.push(i)
        }
    } else {
        if (currentPage < displayPage - 1) {
            for (let i = startPage; i <= displayPage; i++) {
                result.push(i);
            }
            if (endPage > displayPage) {
                result.push('...');
                result.push(endPage);
            }
        } else if (currentPage > displayPage - 2) {
            if (startPage < currentPage - 2) {
                result.push(startPage);
                result.push('...');
            }
            for (let i = Math.max(startPage, currentPage - 2); i <= Math.min(currentPage + 2, endPage); i++) {
                result.push(i);
            }
            if (endPage > currentPage + 2 && currentPage !== endPage - 2) {
                result.push('...');
                result.push(endPage);
            }
        }
    }

    return result;
});
</script>

<template>
    <div class="pagination">
        <ul class="page__wrapper">
            <li v-if="props.page !== 1">
                <router-link to="/" :query="{page: props.page + 1}" @click="$emit('change', props.page - 1)">Prev</router-link>
            </li>
            <li
                v-for="pageNumber in displayedPages"
                :key="pageNumber"
                class="page"
                :class="{'current-page': props.page === pageNumber}"
            >
                <router-link
                    to="/"
                    :query="{page: pageNumber}"
                    @click="$emit('change', pageNumber)"
                >
                    {{ pageNumber }}
                </router-link>
            </li>
            <li v-if="props.page !== totalPages">
                <router-link to="/" :query="{page: props.page + 1}" @click="$emit('change', props.page + 1)">Next</router-link>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.pagination {
    margin-top: 20px;
    margin-bottom: 50px;
}

.page__wrapper {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.page {
    border: 1px solid #424242;
    padding: 10px;
    border-radius: 1rem;
}

.current-page {
    border: 2px solid #b8860b;
}

a {
    text-decoration: none;
}

@media screen and (max-width: 1024px) {
    .pagination {
        margin-top: 10px;
    }
}
</style>