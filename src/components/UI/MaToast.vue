<script setup>
import {onMounted, ref, defineProps} from "vue";

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 3000
    },
    type: {
        type: String,
        required: true
    }
})

const show = ref(true)

onMounted(() => {
    setTimeout(() => {
        show.value = false
    }, props.duration)
})
</script>

<template>
<div v-if="show" class="toast" :class="{'error': type === 'error', 'success': type === 'success', 'info': type === 'info'}">{{message}}</div>
</template>

<style scoped>
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
}

.info {
    background-color: #2B4FB9;
}

.error {
    background-color: #ff4d4f;
}

.success {
    background-color:  #5cb85c;
}
</style>