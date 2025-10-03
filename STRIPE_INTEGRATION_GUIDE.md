# 🎯 Guía de Integración de Stripe - Trastalia

Esta guía explica cómo usar las **dos implementaciones de Stripe** disponibles en el proyecto.

## 📋 Índice

1. [Configuración Inicial](#configuración-inicial)
2. [Opción 1: Checkout Sessions](#opción-1-checkout-sessions)
3. [Opción 2: Payment Intents](#opción-2-payment-intents)
4. [Diferencias entre ambas opciones](#diferencias)
5. [Pruebas](#pruebas)

---

## 🔧 Configuración Inicial

### 1. Obtener Claves de Stripe

1. Ve a [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Crea una cuenta o inicia sesión
3. Navega a **Developers > API keys**
4. Copia tus claves de **prueba** (Test):
   - `pk_test_...` (Publishable key)
   - `sk_test_...` (Secret key)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Stripe - Frontend (Vue)
VITE_STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica_aqui
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui

# Stripe - Backend (Express)
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui

# JWT para autenticación
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# URL del frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Verificar Instalación de Dependencias

Las dependencias ya están instaladas en el proyecto:

```json
{
  "@stripe/stripe-js": "^8.0.0",    // Frontend
  "stripe": "^19.0.0"                 // Backend
}
```

---

## 🛒 Opción 1: Checkout Sessions

**Redirige al usuario a una página de pago de Stripe (alojada por Stripe).**

### Backend

Endpoint: `POST /api/stripe/create-checkout-session`

```javascript
// Ya implementado en: server/routes/stripe.cjs

// Uso:
const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [
      {
        id: '123',
        title: 'Producto de prueba',
        price: 10.00,
        quantity: 1
      }
    ]
  })
})
```

### Frontend

Componente: `src/components/modals/StripePaymentModal.vue`

```vue
<template>
  <StripePaymentModal
    :is-open="showPaymentModal"
    :cart-items="cartItems"
    @close="showPaymentModal = false"
    @payment-success="handleSuccess"
  />
</template>

<script setup>
import StripePaymentModal from '@/components/modals/StripePaymentModal.vue'
</script>
```

### Ventajas
- ✅ Más fácil de implementar
- ✅ Stripe maneja toda la UI de pago
- ✅ Cumple automáticamente con PCI DSS
- ✅ Soporte para múltiples métodos de pago

### Desventajas
- ❌ Menos personalización visual
- ❌ Redirige al usuario fuera de tu sitio

---

## 💳 Opción 2: Payment Intents (Nuevo)

**Formulario de pago embebido directamente en tu aplicación.**

### Backend

Endpoint: `POST /api/stripe/create-payment-intent`

```javascript
// Ya implementado en: server/routes/stripe.cjs

// Uso:
const response = await fetch(`${API_BASE_URL}/api/stripe/create-payment-intent`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    amount: 10.00,    // Monto en euros
    currency: 'eur'
  })
})
```

### Frontend

**Opción A: Componente Modal**

```vue
<template>
  <StripePaymentElementModal
    :is-open="showPaymentModal"
    :amount="100"
    currency="eur"
    @close="showPaymentModal = false"
    @payment-success="handleSuccess"
  />
</template>

<script setup>
import StripePaymentElementModal from '@/components/modals/StripePaymentElementModal.vue'
</script>
```

**Opción B: Página de Prueba**

Visita: `http://localhost:5173/stripe/test`

Archivo: `src/views/stripe/TestPayment.vue`

### Ventajas
- ✅ **Mejor experiencia de usuario** (sin redirección)
- ✅ **Personalización total** del diseño
- ✅ Mejor control del flujo de pago
- ✅ Modern Payment Elements (adaptable a dark mode)

### Desventajas
- ❌ Requiere más código
- ❌ Más configuración inicial

---

## 🔄 Diferencias

| Característica | Checkout Sessions | Payment Intents |
|----------------|-------------------|-----------------|
| **Integración** | Más simple | Más compleja |
| **UI** | Página de Stripe | Embebido en tu app |
| **Personalización** | Limitada | Total |
| **Redirección** | Sí | No |
| **Manejo de errores** | Automático | Manual |
| **Métodos de pago** | Muchos | Configurables |

---

## 🧪 Pruebas

### Tarjetas de Prueba de Stripe

```
✅ Pago exitoso:
   4242 4242 4242 4242

🔐 Requiere autenticación 3D Secure:
   4000 0027 6000 3184

❌ Pago rechazado:
   4000 0000 0000 0002

📅 Fecha de expiración:
   Cualquier fecha futura (ej: 12/25)

🔢 CVC:
   Cualquier 3 dígitos (ej: 123)

📬 Código postal:
   Cualquier código válido
```

### Flujo de Prueba Completo

#### Para Checkout Sessions:

1. Inicia el backend:
   ```bash
   npm start
   ```

2. Inicia el frontend:
   ```bash
   npm run dev
   ```

3. Ve a tu app y haz clic en "Comprar con dinero"
4. Usa una tarjeta de prueba
5. Completa el pago en la página de Stripe
6. Serás redirigido a `/payment/success`

#### Para Payment Intents:

1. Inicia el backend y frontend (mismo comando anterior)
2. Ve a: `http://localhost:5173/stripe/test`
3. Usa una tarjeta de prueba
4. El pago se procesa sin salir de tu página
5. Redirige automáticamente a `/payment/success`

---

## 🔍 Verificar Pagos

1. Ve al [Dashboard de Stripe](https://dashboard.stripe.com/test/payments)
2. Deberías ver los pagos de prueba
3. Puedes ver detalles, reembolsar, etc.

---

## 🚀 Pasar a Producción

1. **Activa tu cuenta de Stripe:**
   - Completa la información de tu negocio
   - Proporciona datos bancarios

2. **Cambia las claves en `.env`:**
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_live_tu_clave_real
   STRIPE_SECRET_KEY=sk_live_tu_clave_real
   ```

3. **Configura webhooks en producción:**
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `payment_intent.succeeded`

4. **Habilita HTTPS** en tu dominio

---

## 📚 Recursos

- [Documentación de Stripe](https://stripe.com/docs)
- [Testing Guide](https://stripe.com/docs/testing)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Checkout Sessions](https://stripe.com/docs/payments/checkout)

---

## ❓ Preguntas Frecuentes

### ¿Cuál opción debo usar?

- **Checkout Sessions**: Si quieres implementación rápida y simple
- **Payment Intents**: Si quieres mejor UX y control total

### ¿Puedo usar ambas?

Sí, ambas están implementadas y puedes usar la que prefieras según el caso de uso.

### ¿Qué pasa con los webhooks?

Los webhooks ya están configurados en `server/routes/stripe.cjs`. Solo necesitas:
1. Configurar la URL en el Dashboard de Stripe
2. Agregar `STRIPE_WEBHOOK_SECRET` a tu `.env`

---

## 🆘 Solución de Problemas

### Error: "Invalid API Key"
- ✅ Verifica que copiaste correctamente las claves
- ✅ Asegúrate de usar claves de **prueba** (`pk_test_...`, `sk_test_...`)
- ✅ Reinicia el servidor después de cambiar variables

### Error: "No autorizado"
- ✅ Verifica que estés logueado
- ✅ Comprueba que el token JWT sea válido

### El formulario no se muestra
- ✅ Verifica que `VITE_STRIPE_PUBLIC_KEY` esté configurada
- ✅ Revisa la consola del navegador para ver errores

---

¿Necesitas ayuda? Revisa los logs del servidor y del navegador para más detalles.

