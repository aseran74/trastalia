import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  article: {
    title: string
    description: string
    images: string[]
  }
  price: number
  originalArticle: any
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => items.value.length)
  
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price, 0)
  })

  const addItem = (item: CartItem) => {
    // Verificar si el artículo ya está en el carrito
    const existingItem = items.value.find(cartItem => cartItem.id === item.id)
    if (!existingItem) {
      items.value.push(item)
      return true
    }
    return false
  }

  const removeItem = (itemId: string) => {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
      return true
    }
    return false
  }

  const clearCart = () => {
    items.value = []
  }

  const isInCart = (itemId: string) => {
    return items.value.some(item => item.id === itemId)
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    clearCart,
    isInCart
  }
})
