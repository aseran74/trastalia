# 🧪 Guía de Prueba - Sistema de Compra de Artículos

## ✅ Estado del Sistema

### Servidor Backend
- **Puerto**: 3002
- **Estado**: ✅ Funcionando correctamente
- **Artículos disponibles**: 100+ artículos públicos

### Frontend
- **Puerto**: 5173
- **Estado**: Funcionando

## 🔍 Flujos de Usuario Corregidos

### 1. Usuario NO Autenticado
1. **Ir a la landing page**: `http://localhost:5173/`
2. **Ver artículos públicos**: Click en "Ver Artículos" o ir a `/articulos`
3. **Ver detalles**: Click en "Ver Detalles" de cualquier artículo
4. **Intentar comprar**: Se redirige automáticamente a `/login`

### 2. Usuario Autenticado
1. **Iniciar sesión**: `/login` (usar `juan@correo.com` / `contrasena`)
2. **Ver artículos públicos**: `/articulos`
3. **Ver detalles**: Click en "Ver Detalles" - ahora funciona ✅
4. **Comprar con dinero**: 
   - Click en "Comprar por €XX"
   - Se abre modal de pago de Stripe
   - Procesar pago
   - ✅ Artículo comprado

5. **Comprar con puntos**:
   - Click en "Comprar por XX puntos"
   - Confirmar compra
   - ✅ Artículo canjeado

### 3. Desde el Dashboard (Usuario Autenticado)
1. **Ir al dashboard**: `/dashboard` o `/comprar-articulos`
2. **Ver artículos del admin**: Lista de artículos disponibles
3. **Ver detalles**: Click en "Ver Detalles"
4. **Comprar**: Mismo flujo que el punto 2

## 🐛 Problemas Corregidos

### ❌ Problema Original
- Los artículos se veían pero no se podía comprar ni ver detalles
- Redireccionaba incorrectamente al dashboard en lugar de mostrar detalles
- Duplicación de rutas causaba conflictos

### ✅ Soluciones Aplicadas
1. **Router**: 
   - ✅ Eliminada duplicación de ruta `/mis-compras`
   - ✅ Rutas funcionan correctamente

2. **Vista Pública**:
   - ✅ Botones "Ver Detalles" redirigen a `/articulos/:id`
   - ✅ Botones de compra redirigen a detalles cuando está autenticado
   - ✅ Muestra modal de login cuando no está autenticado

3. **Vista de Detalles**:
   - ✅ Verifica autenticación antes de permitir comprar
   - ✅ Muestra botones de compra solo para usuarios autenticados
   - ✅ Procesa compras con dinero a través de Stripe
   - ✅ Procesa compras con puntos correctamente

## 🔧 Configuración Verificada

### API
- `src/config/api.js`: ✅ Configurado para usar `http://localhost:3002` en desarrollo
- Endpoints funcionando:
  - ✅ `/api/health` - Health check
  - ✅ `/api/articles/public` - Artículos públicos
  - ✅ `/api/articles/:id` - Detalle de artículo
  - ✅ `/api/articles/:id/buy-points` - Compra con puntos
  - ✅ `/api/auth/login` - Login
  - ✅ `/api/articles/admin-owned` - Artículos del admin

## 📋 Cómo Probar

### Opción 1: Modo Desarrollo
```bash
# Terminal 1 - Backend
npm start
# O
node server/working-server.cjs

# Terminal 2 - Frontend
npm run dev
```

### Opción 2: Modo Producción Local
```bash
# Compilar frontend
npm run build

# Iniciar servidor (sirve frontend + backend)
npm start
```

## 🌐 URLs Importantes

- **Landing Page**: http://localhost:5173/
- **Artículos Públicos**: http://localhost:5173/articulos
- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard
- **Comprar Artículos (Dashboard)**: http://localhost:5173/comprar-articulos

## 👤 Usuarios de Prueba

### Usuario Normal
- **Email**: `juan@correo.com`
- **Password**: `contrasena`
- **Puntos**: ~8621

### Admin
- **Email**: `admin@trastalia.com`
- **Password**: (verificar en base de datos)

## ✅ Checklist de Verificación

- [ ] El servidor backend está ejecutándose en puerto 3002
- [ ] El frontend está ejecutándose en puerto 5173
- [ ] Puedo ver artículos en `/articulos`
- [ ] Puedo hacer click en "Ver Detalles" y ver la página de detalles
- [ ] Si NO estoy logueado, me redirige a `/login` al intentar comprar
- [ ] Si ESTOY logueado, puedo ver los botones de compra
- [ ] Puedo comprar con dinero (abre modal de Stripe)
- [ ] Puedo comprar con puntos (si tengo suficientes)

## 🚀 Próximos Pasos

Si todo funciona correctamente en local:
1. Hacer commit de los cambios
2. Deployar en producción
3. Verificar que las variables de entorno están configuradas correctamente en producción

