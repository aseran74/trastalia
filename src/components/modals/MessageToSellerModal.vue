<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Mensaje al Vendedor</h3>
        <button
          @click="closeModal"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Seller Info -->
        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 font-semibold text-sm">
                {{ sellerInitial }}
              </span>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ sellerName }}</p>
              <p class="text-sm text-gray-500">Vendedor</p>
            </div>
          </div>
        </div>

        <!-- Article Info -->
        <div class="mb-4 p-3 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Artículo:</p>
          <p class="font-medium text-gray-900">{{ articleTitle }}</p>
          <p class="text-sm text-blue-600">€{{ articlePrice }}</p>
        </div>

        <!-- Message Form -->
        <form @submit.prevent="sendMessage" class="space-y-4">
          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Asunto
            </label>
            <select
              v-model="messageData.subject"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecciona un asunto</option>
              <option value="pregunta">Pregunta sobre el artículo</option>
              <option value="oferta">Hacer una oferta</option>
              <option value="entrega">Consulta sobre entrega</option>
              <option value="estado">Estado del artículo</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mensaje
            </label>
            <textarea
              v-model="messageData.message"
              rows="4"
              placeholder="Escribe tu mensaje aquí..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">{{ messageData.message.length }}/500 caracteres</p>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="sending"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ sending ? 'Enviando...' : 'Enviar Mensaje' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import API_BASE_URL from '@/config/api.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  seller: {
    type: Object,
    default: () => ({})
  },
  article: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'message-sent'])

// Estado
const sending = ref(false)
const messageData = ref({
  subject: '',
  message: ''
})

// Computed
const sellerName = computed(() => {
  return props.seller?.name || props.seller?.email || 'Vendedor'
})

const sellerInitial = computed(() => {
  const name = sellerName.value
  return name.charAt(0).toUpperCase()
})

const articleTitle = computed(() => {
  return props.article?.title || props.article?.nombre || 'Artículo'
})

const articlePrice = computed(() => {
  return props.article?.price || props.article?.precio_propuesto_vendedor || 0
})

// Métodos
const closeModal = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  messageData.value = {
    subject: '',
    message: ''
  }
  sending.value = false
}

const sendMessage = async () => {
  if (messageData.value.message.length > 500) {
    alert('El mensaje no puede exceder los 500 caracteres')
    return
  }

  sending.value = true

  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    
    const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        recipientId: props.seller?._id || props.seller?.id,
        articleId: props.article?._id || props.article?.id,
        subject: messageData.value.subject,
        message: messageData.value.message,
        type: 'buyer_to_seller'
      })
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        alert('¡Mensaje enviado exitosamente!')
        emit('message-sent')
        closeModal()
      } else {
        alert('Error al enviar mensaje: ' + data.message)
      }
    } else {
      alert('Error al enviar el mensaje')
    }
  } catch (error) {
    console.error('Error enviando mensaje:', error)
    alert('Error al enviar el mensaje')
  } finally {
    sending.value = false
  }
}
</script>
