# 📸 Guía de Integración con Unsplash

## 🎯 **Descripción**
Sistema completo para integrar fotos de Unsplash en los artículos de Trastalia, con almacenamiento persistente en MongoDB.

## 🚀 **Características**

### **Backend (Node.js + Express)**
- ✅ **Modelo de datos** para fotos de artículos (`ArticlePhoto.js`)
- ✅ **Servicio Unsplash** para interactuar con la API (`unsplashService.js`)
- ✅ **Endpoints REST** para gestionar fotos (`/api/photos/*`)
- ✅ **Almacenamiento persistente** en MongoDB
- ✅ **Autenticación** requerida para operaciones de escritura

### **Frontend (Vue.js)**
- ✅ **Componente de gestión** de fotos (`ArticlePhotoManager.vue`)
- ✅ **Búsqueda por categoría** en Unsplash
- ✅ **Fotos aleatorias** por categoría
- ✅ **Gestión de fotos principales**
- ✅ **Interfaz moderna** con gradientes y animaciones

## 📋 **Endpoints Disponibles**

### **Búsqueda de Fotos**
```http
GET /api/photos/search/:category
GET /api/photos/random/:category
```

### **Gestión de Fotos**
```http
POST /api/photos/save          # Guardar foto
GET /api/photos/article/:id    # Obtener fotos de artículo
PUT /api/photos/:id/primary    # Marcar como principal
DELETE /api/photos/:id         # Eliminar foto
```

### **Categorías**
```http
GET /api/photos/categories     # Obtener categorías disponibles
```

## 🔧 **Configuración**

### **1. Variables de Entorno**
Añade a tu archivo `.env` o configuración de Render:

```env
# Unsplash API Key
UNSPLASH_ACCESS_KEY=tu_unsplash_access_key_aqui
```

### **2. Obtener API Key de Unsplash**
1. Ve a [https://unsplash.com/developers](https://unsplash.com/developers)
2. Crea una cuenta o inicia sesión
3. Crea una nueva aplicación
4. Copia tu **Access Key**
5. Añádela como variable de entorno en Render

### **3. Instalar Dependencias**
```bash
npm install axios
```

## 🎨 **Categorías Soportadas**

- **electronica** → electronics, technology, gadgets
- **ropa** → fashion, clothing, style
- **hogar** → home, interior, furniture
- **deportes** → sports, fitness, gym
- **libros** → books, reading, education
- **juegos** → games, gaming, toys
- **musica** → music, instruments
- **arte** → art, painting, creative
- **coches** → cars, automotive
- **muebles** → furniture, chair, table
- **herramientas** → tools, workshop, diy
- **jardineria** → garden, plants, nature

## 💾 **Estructura de Datos**

### **ArticlePhoto Schema**
```javascript
{
  articleId: ObjectId,        // ID del artículo
  unsplashId: String,         // ID de Unsplash
  url: String,                // URL de la imagen
  thumbUrl: String,           // URL del thumbnail
  altDescription: String,    // Descripción alternativa
  photographer: {             // Información del fotógrafo
    name: String,
    username: String,
    profileUrl: String
  },
  dimensions: {               // Dimensiones
    width: Number,
    height: Number
  },
  color: String,              // Color dominante
  category: String,           // Categoría del artículo
  tags: [String],             // Tags de Unsplash
  isPrimary: Boolean,         // Foto principal
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 **Uso en el Frontend**

### **1. Importar el Componente**
```vue
<template>
  <ArticlePhotoManager />
</template>

<script setup>
import ArticlePhotoManager from '@/components/ArticlePhotoManager.vue'
</script>
```

### **2. Funcionalidades**
- **Seleccionar categoría** del artículo
- **Buscar fotos** en Unsplash por categoría
- **Obtener fotos aleatorias** para inspiración
- **Guardar fotos** en la base de datos
- **Gestionar foto principal** del artículo
- **Eliminar fotos** no deseadas

## 🔒 **Seguridad**

- ✅ **Autenticación requerida** para guardar/eliminar fotos
- ✅ **Validación de datos** en el backend
- ✅ **Rate limiting** de Unsplash API
- ✅ **CORS configurado** para Vercel

## 📊 **Ventajas**

1. **Fotos de alta calidad** de Unsplash
2. **Almacenamiento persistente** en MongoDB
3. **Búsqueda inteligente** por categoría
4. **Gestión de fotos principales**
5. **Interfaz moderna** y fácil de usar
6. **API REST completa** para integración
7. **Escalable** y mantenible

## 🚀 **Próximos Pasos**

1. **Configurar API Key** de Unsplash en Render
2. **Instalar dependencias** (`npm install axios`)
3. **Desplegar cambios** en Render
4. **Probar integración** en el frontend
5. **Añadir componente** a las páginas de artículos

## 🐛 **Solución de Problemas**

### **Error: "UNSPLASH_ACCESS_KEY not found"**
- Verifica que la variable de entorno esté configurada en Render
- Asegúrate de que el nombre sea exactamente `UNSPLASH_ACCESS_KEY`

### **Error: "Rate limit exceeded"**
- Unsplash tiene límites de API (50 requests/hour para apps no verificadas)
- Considera implementar caché para reducir llamadas

### **Error: "Photo not found"**
- Verifica que el `unsplashId` sea correcto
- Algunas fotos pueden ser eliminadas de Unsplash

## 📞 **Soporte**

Si tienes problemas con la integración:
1. Revisa los logs del servidor
2. Verifica las variables de entorno
3. Comprueba la conectividad con Unsplash API
4. Revisa la autenticación del usuario
