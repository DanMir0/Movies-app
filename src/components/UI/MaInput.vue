<script setup>
const props = defineProps({
    modelValue: String,
    type: String,
    isError: Boolean
});
const emit = defineEmits(['update:modelValue'])
</script>

<template>
        <input
            :type="props.type || 'text'"
            :value="props.modelValue"
            @input="emit('update:modelValue', $event.target.value)"
            :class="{'error': isError}"
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

.error {
    border: 1px solid #ff0000;
}

input:focus {
    outline: none;
    border: 2px solid #7E7E7E;
}
</style>