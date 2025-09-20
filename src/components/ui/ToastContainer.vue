<template>
  <div class="toast-container">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :id="toast.id"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
      :position="toast.position"
      @close="removeToast"
    />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Toast from './Toast.vue'

const toasts = ref([])
let nextId = 1

const addToast = (toast) => {
  const id = `toast-${nextId++}`
  const newToast = {
    id,
    type: 'info',
    duration: 5000,
    position: 'top-right',
    ...toast
  }
  
  toasts.value.push(newToast)
  
  // Auto-remove after duration
  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAll = () => {
  toasts.value = []
}

// Provide toast functions to child components
provide('toast', {
  success: (title, message, options = {}) => addToast({ type: 'success', title, message, ...options }),
  error: (title, message, options = {}) => addToast({ type: 'error', title, message, ...options }),
  warning: (title, message, options = {}) => addToast({ type: 'warning', title, message, ...options }),
  info: (title, message, options = {}) => addToast({ type: 'info', title, message, ...options }),
  add: addToast,
  remove: removeToast,
  clear: clearAll
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
}
</style>
