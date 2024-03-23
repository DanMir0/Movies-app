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
@media screen and (max-width: 1024px) {
    form {
        max-width: 300px;
        padding: 30px 20px;
    }
}
@media screen and (max-width: 375px) {
    form {
        margin-left: 33px;
        margin-right: 33px;
        max-width: 300px;
        padding: 30px 20px;
    }
}
</style>