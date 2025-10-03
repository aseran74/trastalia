# 🎯 Implementación Completa de Stripe en Trastalia

## ✅ ¿Qué se ha implementado?

### 1. **Backend (Express + MongoDB)**

#### Endpoints disponibles:

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/stripe/create-payment-intent` | POST | Crea Payment Intent (pago embebido) | ✅ Requerida |
| `/api/stripe/create-payment-intent-test` | POST | Payment Intent SIN auth (solo pruebas) | ❌ No |
| `/api/stripe/create-checkout-session` | POST | Crea sesión de Checkout (redirige a Stripe) | ✅ Requerida |
| `/api/stripe/webhook` | POST | Recibe eventos de Stripe | ❌ No (firma verificada) |
| `/api/stripe/payment-success` | GET | Verifica pago exitoso | ✅ Requerida |

#### Webhooks configurados:

Los webhooks actualizan **automáticamente** MongoDB cuando se completa un pago:

- ✅ **`checkout.session.completed`**: Cuando se completa pago con Checkout Sessions
  - Marca artículos como vendidos
  - Registra la transacción
  - Actualiza información del comprador

- ✅ **`payment_intent.succeeded`**: Cuando se completa Payment Intent
  - Marca artículo como vendido
  - Registra datos de pago

- ✅ **`payment_intent.payment_failed`**: Cuando falla un pago
  - Registra el error
  - (TODO: Notificar al usuario)

---

### 2. **Frontend (Vue 3)**

#### Componentes disponibles:

**a) StripePaymentModal** (Checkout Sessions - Redirige a Stripe)
- **Ubicación**: `src/components/modals/StripePaymentModal.vue`
- **Uso**: Para carritos con múltiples artículos
- **Características**:
  - Redirige a página de pago de Stripe
  - Soporta múltiples artículos
  - Más fácil de implementar

**b) StripePaymentElementModal** (Payment Intents - Embebido)
- **Ubicación**: `src/components/modals/StripePaymentElementModal.vue`
- **Uso**: Para compra de un solo artículo
- **Características**:
  - Formulario embebido en tu sitio
  - No redirige al usuario
  - Mejor experiencia de usuario

#### Vistas con integración:

✅ **`ArticleDetailNew.vue`** - Ya integrado con StripePaymentModal
- Ubicación: `src/views/Public/ArticleDetailNew.vue`
- Botón "Comprar con dinero" (línea 252)
- Modal de pago implementado (línea 318)

---

## 🚀 Cómo funciona el flujo completo

### Flujo de Compra con Checkout Sessions (ACTUAL):

```
1. Usuario hace clic en "Comprar con dinero"
   ↓
2. Se abre StripePaymentModal
   ↓
3. Frontend llama a /api/stripe/create-checkout-session
   ↓
4. Backend crea sesión y devuelve URL
   ↓
5. Usuario es redirigido a Stripe
   ↓
6. Usuario paga con tarjeta
   ↓
7. Stripe envía webhook a /api/stripe/webhook
   ↓
8. Webhook actualiza MongoDB automáticamente:
   - Artículo marcado como "sold"
   - Se crea registro en "transactions"
   ↓
9. Usuario redirigido a /payment/success
```

### Cambios en MongoDB al completar pago:

```javascript
// Artículo actualizado:
{
  status: 'sold',
  estado: 'vendido',
  sold: true,
  buyer: ObjectId("userId"),
  soldAt: new Date(),
  paymentMethod: 'stripe_checkout',
  stripeSessionId: 'cs_test_...',
  paidAmount: 50.00,
  currency: 'eur'
}

// Nueva transacción creada:
{
  userId: ObjectId("userId"),
  articleIds: [ObjectId("articleId")],
  amount: 50.00,
  currency: 'eur',
  paymentMethod: 'stripe_checkout',
  stripeSessionId: 'cs_test_...',
  status: 'completed',
  createdAt: new Date()
}
```

---

## 🔧 Configuración Actual

### Variables de entorno (.env):

```env
# Stripe Keys (TEST MODE)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# JWT & Session
JWT_SECRET=tu_jwt_secret
SESSION_SECRET=tu_session_secret

# URLs
FRONTEND_URL=http://localhost:5173
```

### Archivos modificados/creados:

| Archivo | Descripción |
|---------|-------------|
| `server/routes/stripe.cjs` | ✅ Endpoints + Webhooks con MongoDB |
| `src/components/modals/StripePaymentElementModal.vue` | ✅ Modal Payment Intent (nuevo) |
| `src/views/stripe/TestPayment.vue` | ✅ Página de prueba |
| `src/router/index.ts` | ✅ Ruta `/stripe/test` agregada |
| `src/config/api.js` | ✅ Actualizado a puerto 3001 |
| `env.example` | ✅ Variables de Stripe agregadas |
| `STRIPE_INTEGRATION_GUIDE.md` | ✅ Guía de uso |

---

## 🧪 Testing

### Prueba rápida (sin auth):

```bash
# 1. Iniciar servidores
npm run start:all

# 2. Ir a:
http://localhost:5173/stripe/test

# 3. Usar tarjeta de prueba:
Número: 4242 4242 4242 4242
Fecha: 12/25
CVC: 123
```

### Prueba en artículo real:

```bash
# 1. Login en Trastalia
http://localhost:5173/login

# 2. Ir a cualquier artículo
http://localhost:5173/articulos/[id]

# 3. Click en "Comprar con dinero"

# 4. Pagar con tarjeta de prueba

# 5. Verificar en logs del servidor:
✅ Pago completado: cs_test_...
✅ Artículo [id] marcado como vendido
✅ Transacción registrada en MongoDB
```

---

## 📊 Monitoreo

### Logs del servidor a observar:

```bash
💳 Creando sesión de Stripe Checkout
✅ Sesión de Stripe creada: cs_test_...
📨 Webhook recibido: checkout.session.completed
✅ Artículo 123abc marcado como vendido
✅ Transacción registrada en MongoDB
```

### Dashboard de Stripe:

1. Ve a: https://dashboard.stripe.com/test/payments
2. Verás todos los pagos de prueba
3. Click en cualquier pago para ver detalles

---

## 🔜 Próximos pasos recomendados

### 1. **Notificaciones por email** 📧
```javascript
// En webhook, después de marcar artículo como vendido:
- Enviar email al comprador con detalles
- Enviar email al vendedor notificando venta
- Incluir información de contacto mutuo
```

### 2. **Panel de transacciones** 💼
```javascript
// Crear vista en admin para ver:
- Historial de todas las transacciones
- Filtrar por usuario, fecha, estado
- Exportar a CSV/Excel
```

### 3. **Reembolsos** 💰
```javascript
// Agregar endpoint para procesar reembolsos:
POST /api/stripe/refund
{
  sessionId: 'cs_test_...',
  reason: 'requested_by_customer'
}
```

### 4. **Producción** 🚀
```bash
# Cambiar a claves LIVE:
VITE_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Configurar webhook en Stripe Dashboard:
URL: https://trastalia.com/api/stripe/webhook
Eventos: checkout.session.completed, payment_intent.succeeded
```

---

## ❓ Troubleshooting

### Problema: "Invalid API Key"
**Solución**: Verifica que las claves en `.env` sean correctas y reinicia el servidor

### Problema: Webhook no se ejecuta
**Solución**: 
1. Para desarrollo local, usa Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3001/api/stripe/webhook
   ```
2. Para producción, configura webhook en Dashboard de Stripe

### Problema: Artículo no se marca como vendido
**Solución**: 
1. Revisa los logs del servidor
2. Verifica que el webhook esté recibiendo `articleIds` correctamente
3. Comprueba conexión a MongoDB

---

## 📞 Soporte

Si tienes dudas:
1. Revisa los logs del servidor (terminal backend)
2. Revisa la consola del navegador (F12)
3. Consulta la documentación de Stripe: https://stripe.com/docs

---

**Estado actual**: ✅ **COMPLETAMENTE FUNCIONAL**

- ✅ Pagos funcionando
- ✅ Webhooks actualizando MongoDB
- ✅ Integrado en vista de artículos
- ⏳ Pendiente: Emails y panel admin

