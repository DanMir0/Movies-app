<script setup>

import MaNavbar from "@/components/UI/MaNavbar.vue";
</script>

<template>
  <ma-navbar></ma-navbar>
  <div>
    <router-view></router-view>
  </div>

</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
