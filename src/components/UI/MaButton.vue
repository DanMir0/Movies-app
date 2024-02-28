<script setup>
defineProps({
    isDisabled: Boolean
})
</script>

<template>
    <button :class="{'btn__disabled': isDisabled}">
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    padding: 0.7em 2em;
    background-color: #303030;
    border: none;
}

.btn__disabled {
    background-color: #3e3e3e;
}

.btn__disabled:hover {
    cursor: default;
}

button:hover {
    background-color: #3e3e3e;
    cursor: pointer;
}
</style>