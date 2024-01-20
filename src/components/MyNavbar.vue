<script setup>
defineProps({
  searchQuery: String,
})

defineEmits(['update:searchQuery'])
</script>

<template>
<div>
  <input
      :value="searchQuery"
      @input="$emit('update:searchQuery', $event.target.value)"
      placeholder="Search...">
</div>
</template>

<style scoped>

</style>