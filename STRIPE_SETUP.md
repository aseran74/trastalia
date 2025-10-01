# 🔷 Configuración de Stripe para Trastalia

Esta guía te ayudará a configurar Stripe para procesar pagos reales en tu aplicación.

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Cuenta Stripe](#configuración-de-cuenta-stripe)
3. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
4. [Configuración de Webhooks](#configuración-de-webhooks)
5. [Pruebas](#pruebas)
6. [Producción](#producción)

---

## 🎯 Requisitos Previos

- ✅ Cuenta de Stripe (gratuita)
- ✅ Node.js instalado
- ✅ Proyecto Trastalia configurado

---

## 🔐 Configuración de Cuenta Stripe

### 1. Crear/Iniciar Sesión en Stripe

1. Ve a [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Crea una cuenta o inicia sesión
3. Completa el proceso de verificación

### 2. Obtener las Claves API

1. Ve al Dashboard de Stripe
2. Navega a **Developers > API keys**
3. Verás dos tipos de claves:

   **🔹 Claves de Prueba (Test Keys):**
   - `pk_test_...` (Publishable key - Pública)
   - `sk_test_...` (Secret key - Secreta)

   **🔹 Claves de Producción (Live Keys):**
   - `pk_live_...` (Publishable key - Pública)
   - `sk_live_...` (Secret key - Secreta)

⚠️ **IMPORTANTE:** Usa las claves de **prueba** primero para desarrollo.

---

## ⚙️ Configuración de Variables de Entorno

### Frontend (.env en la raíz del proyecto)

Agrega o actualiza tu archivo `.env`:

```env
# Stripe - Clave Pública (Frontend)
VITE_STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica_aqui

# URL del API Backend
VITE_API_BASE_URL=http://localhost:3002
```

### Backend (variables de entorno del servidor)

Agrega estas variables en el archivo `.env` del servidor o en tu plataforma de hosting:

```env
# Stripe - Clave Secreta (Backend)
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui

# Stripe - Webhook Secret (Se obtiene después de configurar webhooks)
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui

# URL del Frontend (para redirecciones)
FRONTEND_URL=http://localhost:5173

# Otras variables necesarias
JWT_SECRET=tu-secreto-super-seguro-2024
MONGODB_URI=tu_mongodb_connection_string
PORT=3002
SESSION_SECRET=trastalia-session-secret-2024
```

---

## 🔔 Configuración de Webhooks

Los webhooks permiten que Stripe notifique a tu servidor cuando ocurren eventos (pagos completados, fallidos, etc.).

### Desarrollo Local (usando Stripe CLI)

1. **Instalar Stripe CLI:**
   ```bash
   # Windows (con Scoop)
   scoop install stripe
   
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # O descarga desde: https://stripe.com/docs/stripe-cli
   ```

2. **Autenticar Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Iniciar el webhook listener:**
   ```bash
   stripe listen --forward-to localhost:3002/api/stripe/webhook
   ```

4. **Copia el Webhook Secret** que aparece y agrégalo a tu `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Producción

1. Ve al Dashboard de Stripe
2. Navega a **Developers > Webhooks**
3. Haz clic en **"Add endpoint"**
4. Configura:
   - **URL del endpoint:** `https://tu-dominio.com/api/stripe/webhook`
   - **Eventos a escuchar:**
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
5. Copia el **Signing secret** y agrégalo a tu `.env` de producción

---

## 🧪 Pruebas

### Tarjetas de Prueba de Stripe

Usa estas tarjetas para probar en modo test:

| Número | Tipo | Resultado |
|--------|------|-----------|
| `4242 4242 4242 4242` | Visa | ✅ Éxito |
| `4000 0000 0000 9995` | Visa | ❌ Fallido (fondos insuficientes) |
| `4000 0025 0000 3155` | Visa | ⚠️ Requiere autenticación 3D Secure |

**Datos adicionales para completar:**
- **Fecha de vencimiento:** Cualquier fecha futura (ej: `12/25`)
- **CVV:** Cualquier 3 dígitos (ej: `123`)
- **Código postal:** Cualquier valor (ej: `12345`)

### Flujo de Prueba Completo

1. **Iniciar el backend:**
   ```bash
   cd server
   node working-server.cjs
   ```

2. **Iniciar el frontend:**
   ```bash
   npm run dev
   ```

3. **Iniciar Stripe CLI (webhooks):**
   ```bash
   stripe listen --forward-to localhost:3002/api/stripe/webhook
   ```

4. **Realizar una compra de prueba:**
   - Ve a `http://localhost:5173`
   - Inicia sesión
   - Selecciona un artículo
   - Haz clic en "Comprar con dinero"
   - Usa una tarjeta de prueba
   - Verifica que se redirija a `/payment/success`

5. **Verificar en el Dashboard:**
   - Ve a [Stripe Dashboard > Payments](https://dashboard.stripe.com/test/payments)
   - Deberías ver el pago de prueba

---

## 🚀 Producción

### Antes de Lanzar

**✅ Checklist:**

- [ ] Cambiar de claves `test` a claves `live`
- [ ] Configurar webhooks en producción
- [ ] Habilitar HTTPS en tu dominio
- [ ] Completar la activación de cuenta en Stripe
- [ ] Configurar impuestos (si aplica)
- [ ] Revisar las políticas de reembolso
- [ ] Probar flujo completo en entorno de staging

### Actualizar Variables de Entorno

```env
# Producción
VITE_STRIPE_PUBLIC_KEY=pk_live_tu_clave_publica_real
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_real
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_real
FRONTEND_URL=https://trastalia.vercel.app
```

### Activar Cuenta

Para recibir pagos reales:

1. Ve al Dashboard de Stripe
2. Completa la información de tu negocio
3. Proporciona datos bancarios para recibir transferencias
4. Verifica tu identidad

---

## 📚 Recursos Adicionales

- [Documentación de Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Guide](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com/)

---

## 🆘 Solución de Problemas

### Error: "Invalid API Key"
- ✅ Verifica que la clave esté correctamente copiada
- ✅ Asegúrate de usar claves `test` en desarrollo
- ✅ Reinicia el servidor después de cambiar variables

### Webhook no funciona
- ✅ Verifica que Stripe CLI esté corriendo
- ✅ Comprueba que el puerto del servidor sea correcto
- ✅ Revisa los logs del servidor

### Pago no se completa
- ✅ Revisa la consola del navegador (F12)
- ✅ Verifica que el monto sea mayor a 0
- ✅ Comprueba que el usuario esté autenticado
- ✅ Revisa los logs del servidor backend

---

## 💬 Soporte

Si tienes problemas:
1. Revisa la [documentación oficial de Stripe](https://stripe.com/docs)
2. Consulta el [Stripe Support](https://support.stripe.com/)
3. Revisa los logs del servidor y navegador

---

**¡Listo para procesar pagos! 💳✨**








