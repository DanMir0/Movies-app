<script setup>
</script>

<template>
    <div class="container">
        <router-view></router-view>
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #0f0f0f;
    color: #FFFFFF;
}

.container {
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
}

.navbar {
    border-bottom: 1px solid #424242;
    margin-bottom: 30px;
}
</style>
