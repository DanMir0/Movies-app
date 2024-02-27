<script setup>

</script>

<template>
    <div class="not-found">
        <h1>404 - Not found</h1>
        <p>Sorry, the page you requested was not found.</p>
        <router-link to="/" >Return to home page.</router-link>
    </div>

</template>

<style scoped>
.not-found {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #282c34; /* Цвет фона */
    color: #fff; /* Цвет текста */
}

h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

p {
    font-size: 1.2em;
    margin-bottom: 20px;
}

router-link {
    color: #61dafb; /* Цвет ссылки */
    text-decoration: none;
}

router-link:hover {
    text-decoration: underline;
}
</style>