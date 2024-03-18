<script setup>

</script>

<template>
<div class="container">
    <slot></slot>
</div>
</template>

<style scoped>
.container {
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
}

@media screen and (max-width: 1024px){
    .container {
        max-width: 924px;
    }
}

@media screen and (max-width: 375px){
    .container {
        max-width: 350px;
    }
}
</style>