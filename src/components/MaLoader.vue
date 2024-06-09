<script setup>
const props = defineProps({
    isLoading: {
        type: Boolean,
        required: true,
    }
})
</script>

<template>
    <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
    </div>

</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loader {
    border: 8px dashed #b8860b;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>