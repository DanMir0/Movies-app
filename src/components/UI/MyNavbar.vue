<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";

const searchQuery = ref('')
const router = useRouter()

defineProps({
  searchQuery: String,
})
defineEmits(['update:searchQuery'])
</script>

<template>
  <div>
    <input
        v-model="searchQuery"
        @keyup.enter="$emit('update:searchQuery', $event.target.value)"
        @keydown.enter="router.push({ name: 'SearchPage', query: {q: searchQuery}})"
        placeholder="Search...">
  </div>
</template>

<style scoped>

</style>