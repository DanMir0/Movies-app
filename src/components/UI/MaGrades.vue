<script setup>
import {computed, ref} from 'vue';

const props = defineProps({
    rating: Number,
    closeEdit: Boolean,
    isAdding: Boolean,
})

const emit = defineEmits(['setRating'])


const ratingWidth = computed(() => {
        return props.rating / 10 * 100

})

const ratingWidthStyle = computed(() => {
    return `width: ${ratingWidth.value}%;`
})

</script>

<template>
    <div class="star-rating">
        <span v-for="index in 10" :key="index" class="star star__outline"></span>
        <div class="star-rating__colored" :style="ratingWidthStyle">
            <span v-for="index in 10" :key="index" class="star star__colored"></span>
        </div>
    </div>
</template>

<style scoped>
.star-rating {
    position: relative;
    display: inline-flex;
}

.star-rating__colored {
    display: inline-flex;
    position: absolute;
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
}

.star {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 3px;
    flex-shrink: 0;
}

.star__outline {
    background: url('@/icons/star.svg') center no-repeat;
}

.star__colored {
    background: url('@/icons/star-fill.svg') center no-repeat;
}

@media screen and (max-width: 670px) {
    .star-rating {
        order: 1;
    }
}
</style>