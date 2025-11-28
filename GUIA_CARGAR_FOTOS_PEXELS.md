# 📸 Guía para Cargar Fotos de Pexels en MongoDB

Esta guía explica cómo cargar fotos de Pexels en MongoDB para asociarlas a artículos.

## 🚀 Inicio Rápido

### 1. Verificar configuración

Asegúrate de tener la API Key de Pexels en tu archivo `.env`:

```env
PEXELS_API_KEY=tu_api_key_aqui
MONGODB_URI=mongodb+srv://...
```

### 2. Listar artículos disponibles

Para ver los artículos y obtener sus IDs:

```bash
npm run list-articles
```

O directamente:

```bash
node scripts/list-articles.js
```

Esto mostrará una lista de artículos con sus IDs, nombres, categorías y estados.

### 3. Cargar fotos de Pexels

Una vez que tengas el ID del artículo, carga fotos:

```bash
npm run load-pexels <articleId> <category> [count] [--primary]
```

**Ejemplos:**

```bash
# Cargar 5 fotos de la categoría "electronica" al artículo
npm run load-pexels 507f1f77bcf86cd799439011 electronica 5

# Cargar 3 fotos de "smartphone" y marcar la primera como principal
npm run load-pexels 507f1f77bcf86cd799439011 smartphone 3 --primary

# Cargar 10 fotos de "ropa"
npm run load-pexels 507f1f77bcf86cd799439011 ropa 10
```

## 📋 Parámetros

- **articleId** (requerido): ID del artículo en MongoDB
- **category** (requerido): Categoría o término de búsqueda
- **count** (opcional): Número de fotos a cargar (default: 5)
- **--primary** (opcional): Marcar la primera foto como principal

## 🎨 Categorías Disponibles

El script mapea automáticamente las categorías a términos de búsqueda de Pexels:

- `electronica` → electronics, technology, gadgets
- `ropa` → fashion, clothing, style
- `hogar` → home, interior, furniture
- `deportes` → sports, fitness, gym
- `libros` → books, reading, library
- `juegos` → games, gaming, toys
- `musica` → music, instruments, guitar
- `arte` → art, painting, sculpture
- `coches` → cars, automotive, vehicle
- `motos` → motorcycle, bike
- `bicicletas` → bicycle, bike, cycling
- `muebles` → furniture, chair, table
- `herramientas` → tools, workshop, diy
- `jardineria` → garden, plants, nature
- `mascotas` → pets, dog, cat
- `antigüedades` → antique, vintage, old

También puedes usar términos de búsqueda personalizados:

```bash
npm run load-pexels 507f1f77bcf86cd799439011 "smartphone samsung" 5
```

## 📊 Ejemplo Completo

```bash
# 1. Listar artículos
npm run list-articles

# Salida:
# 1. iPhone 13 Pro
#    ID: 507f1f77bcf86cd799439011
#    Categoría: electronica
#    Estado: EN_VENTA

# 2. Cargar fotos
npm run load-pexels 507f1f77bcf86cd799439011 electronica 5 --primary

# Salida:
# ✅ Conectado a MongoDB
# ✅ Encontradas 5 fotos
# ✅ Foto 1/5 guardada ⭐ (Principal)
# ✅ Foto 2/5 guardada
# ...
# 📊 Resumen:
#    ✅ Guardadas: 5
#    ⏭️  Omitidas: 0
```

## 🔍 Verificar Fotos Cargadas

Puedes verificar las fotos cargadas usando el endpoint de la API:

```bash
GET http://localhost:3002/api/photos/article/<articleId>
```

O consultar directamente en MongoDB:

```javascript
// En MongoDB Compass o mongosh
db.articlephotos.find({ articleId: ObjectId("507f1f77bcf86cd799439011") })
```

## ⚠️ Notas Importantes

1. **Duplicados**: El script evita guardar fotos duplicadas (mismo `photoId` de Pexels)

2. **Foto Principal**: 
   - Si usas `--primary`, la primera foto se marca como principal
   - Si el artículo ya tiene una foto principal, no se sobrescribe a menos que uses `--primary`

3. **Límites de API**: 
   - Free tier: 200 solicitudes/hora
   - El script respeta estos límites

4. **Validación**: 
   - El script valida que el `articleId` sea un ObjectId válido
   - Verifica que la API Key esté configurada

## 🐛 Solución de Problemas

### Error: "PEXELS_API_KEY no está configurada"
- Verifica que el archivo `.env` tenga la clave
- Reinicia el servidor si es necesario

### Error: "El articleId no es un ObjectId válido"
- Verifica que el ID sea correcto usando `npm run list-articles`
- Asegúrate de copiar el ID completo

### No se encuentran fotos
- Prueba con un término de búsqueda más general
- Verifica que la categoría esté en la lista de categorías soportadas

### Fotos duplicadas
- El script detecta y omite fotos duplicadas automáticamente
- Esto es normal si ejecutas el script varias veces

## 📚 Recursos Adicionales

- [Documentación de Pexels API](https://www.pexels.com/api/documentation/)
- [Guía de integración con Pexels](./PEXELS_INTEGRATION_GUIDE.md)

