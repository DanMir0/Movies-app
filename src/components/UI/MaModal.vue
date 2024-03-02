<script setup>
const open = defineProps({
    type: Boolean,
    required: true
})
const emit = defineEmits(['close', 'openModal'])

const openModal = () => {
    emit('openModal')
}
</script>

<template>
    <transition name="fade">
        <div class="vue-modal" id="maModal">
            <transition name="drop-in">
                <div class="vue-modal-inner" v-show="open">
                    <div class="vue-modal-content">
                        <slot class="msg"/>
                        <button @click="$emit('close')">Close</button>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<style scoped>
.vue-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

.vue-modal-inner {
    max-width: 500px;
    margin: 18rem auto;
}

.vue-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.3);
    background-clip: padding-box;
    border-radius: 1rem;
    padding: 2rem;
}

.msg {
    background-color: transparent;
    color: #000000;
}

button {
    background: transparent;
    padding: 1rem;
    border-radius: 1rem;
    color: #000000;
    margin-top: 10px;
}

button:hover {
    opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
    transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
    opacity: 0;
    transform: translateY(-50px);
}
</style>