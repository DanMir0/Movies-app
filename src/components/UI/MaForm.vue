<script setup>
defineProps({
    isError: Boolean
})
</script>

<template>
    <form @submit.prevent :class="{'form__error': isError}">
        <slot></slot>
    </form>
</template>

<style scoped>
form {
    margin: 110px auto;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #b8860b;
    padding: 50px 40px;
    border-radius: 15px;
    gap: 20px;
}

.form__error {
    border: 1px solid #ff0000;
}
</style>