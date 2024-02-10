<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <input
        :value="props.modelValue"
        @input="emit('update:modelValue', $event.target.value)"
    />
</template>

<style scoped>
input {
    width: 100%;
    padding: 15px;
    background-color: transparent;
    border-radius: 28px;
    border: 1px solid #424242;
    color: #f1f1f1;
}
</style>