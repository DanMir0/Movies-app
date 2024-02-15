<script setup>

</script>

<template>
<button>
    <slot></slot>
</button>
</template>

<style scoped>
button {
    padding: 0.7em 2em;
    background-color: #303030;
    border: none;
}

button:hover {
    background-color: #3e3e3e;
    cursor: pointer;
}
</style>