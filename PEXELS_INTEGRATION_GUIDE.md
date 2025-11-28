# 📸 Guía de Integración con Pexels

## 🎯 **Descripción**
Sistema completo para integrar fotos de Pexels en los artículos de Trastalia, con almacenamiento persistente en MongoDB. Esta integración complementa la existente con Unsplash.

## 🚀 **Características**

### **Backend (Node.js + Express)**
- ✅ **Modelo de datos actualizado** para soportar tanto Unsplash como Pexels (`ArticlePhoto.js`)
- ✅ **Servicio Pexels** para interactuar con la API (`pexelsService.js`)
- ✅ **Endpoints REST** para gestionar fotos de Pexels (`/api/photos/pexels/*`)
- ✅ **Almacenamiento persistente** en MongoDB
- ✅ **Autenticación** requerida para operaciones de escritura

## 📋 **Endpoints Disponibles**

### **Búsqueda de Fotos de Pexels**

#### Buscar por categoría
```http
GET /api/photos/pexels/search/:category
```
Parámetros de consulta:
- `page` (opcional): Número de página (default: 1)
- `perPage` (opcional): Fotos por página (default: 10)
- `orientation` (opcional): all, landscape, portrait, square (default: all)
- `color` (opcional): all, red, orange, yellow, green, turquoise, blue, violet, pink, brown, black, gray, white (default: all)
- `size` (opcional): all, large, medium, small (default: all)

Ejemplo:
```bash
GET /api/photos/pexels/search/electronica?page=1&perPage=12&orientation=landscape
```

#### Buscar por query personalizado
```http
GET /api/photos/pexels/search?query=smartphone&page=1&perPage=10
```

#### Obtener fotos populares/curated
```http
GET /api/photos/pexels/curated?count=10&page=1
```

#### Obtener foto por ID
```http
GET /api/photos/pexels/:photoId
```

### **Gestión de Fotos**
```http
POST /api/photos/save          # Guardar foto (soporta Unsplash y Pexels)
GET /api/photos/article/:id     # Obtener fotos de artículo
PUT /api/photos/:id/primary     # Marcar como principal
DELETE /api/photos/:id          # Eliminar foto
```

## 🔧 **Configuración**

### **1. Variables de Entorno**
Añade a tu archivo `.env` o configuración de Render:

```env
# Pexels API Key
PEXELS_API_KEY=tu_pexels_api_key_aqui
```

### **2. Obtener API Key de Pexels**
1. Ve a [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. Crea una cuenta o inicia sesión
3. Crea una nueva aplicación
4. Copia tu **API Key**
5. Añádela como variable de entorno en Render o en tu archivo `.env` local

### **3. Instalar Dependencias**
Las dependencias ya están instaladas (`axios`), pero si necesitas instalarlas:
```bash
npm install axios
```

## 🎨 **Categorías Soportadas**

El servicio mapea automáticamente las categorías de artículos a términos de búsqueda de Pexels:

- **electronica** → electronics, technology, gadgets, smartphone, laptop, computer
- **ropa** → fashion, clothing, style, outfit, dress, clothes
- **hogar** → home, interior, furniture, decoration, kitchen, living room
- **deportes** → sports, fitness, gym, running, bicycle, exercise
- **libros** → books, reading, library, education, study, book
- **juegos** → games, gaming, toys, board games, video games, play
- **musica** → music, instruments, guitar, piano, concert, musical
- **arte** → art, painting, sculpture, creative, design, artwork
- **coches** → cars, automotive, vehicle, transport, road, car
- **motos** → motorcycle, bike, scooter, two wheeler
- **bicicletas** → bicycle, bike, cycling, bike ride, mountain bike
- **muebles** → furniture, chair, table, sofa, bed, furnishing
- **herramientas** → tools, workshop, diy, construction, repair, tool
- **jardineria** → garden, plants, nature, outdoor, flowers, gardening
- **mascotas** → pets, dog, cat, animals, pet care, animal
- **antigüedades** → antique, vintage, old, retro, classic, antique furniture
- **otros** → object, item, product, thing, stuff

## 📝 **Ejemplo de Uso**

### **Buscar fotos de Pexels por categoría**
```javascript
// Frontend (Vue.js)
const searchPexelsPhotos = async (category) => {
  const response = await fetch(
    `${apiUrl}/api/photos/pexels/search/${category}?page=1&perPage=12`
  );
  const data = await response.json();
  return data;
};
```

### **Guardar foto de Pexels**
```javascript
// Frontend (Vue.js)
const savePexelsPhoto = async (photo, articleId) => {
  const response = await fetch(`${apiUrl}/api/photos/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      articleId,
      source: 'pexels',
      pexelsId: photo.id,
      photoId: photo.id.toString(),
      url: photo.url,
      thumbUrl: photo.thumbUrl,
      altDescription: photo.altDescription,
      photographer: photo.photographer,
      dimensions: photo.dimensions,
      color: photo.color,
      category: selectedCategory,
      tags: photo.tags,
      isPrimary: false
    })
  });
  return await response.json();
};
```

### **Backend - Ejemplo de respuesta**
```json
{
  "success": true,
  "data": [
    {
      "id": "123456",
      "url": "https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "thumbUrl": "https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg?auto=compress&cs=tinysrgb&w=350",
      "fullUrl": "https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg",
      "altDescription": "Foto de ejemplo",
      "photographer": {
        "name": "John Doe",
        "username": "12345",
        "profileUrl": "https://www.pexels.com/@johndoe"
      },
      "dimensions": {
        "width": 1920,
        "height": 1080
      },
      "color": "#a1b2c3",
      "description": "Foto de ejemplo",
      "tags": []
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 12,
    "total": 5000,
    "totalPages": 417
  }
}
```

## 🔄 **Compatibilidad con Unsplash**

El sistema ahora soporta tanto **Unsplash** como **Pexels**:

- **Unsplash**: Endpoints `/api/photos/search/:category` y `/api/photos/random/:category`
- **Pexels**: Endpoints `/api/photos/pexels/*`
- **Guardar**: El endpoint `/api/photos/save` acepta fotos de ambas fuentes usando el campo `source`

### **Estructura del modelo actualizado**
```javascript
{
  articleId: ObjectId,
  source: 'unsplash' | 'pexels',  // Nueva
  unsplashId: String,              // Solo si source === 'unsplash'
  pexelsId: Number,                // Solo si source === 'pexels'
  photoId: String,                 // ID genérico (nuevo)
  url: String,
  thumbUrl: String,
  // ... resto de campos
}
```

## ⚠️ **Límites de la API de Pexels**

- **Free tier**: 200 solicitudes por hora
- **Premium tier**: 10,000 solicitudes por hora
- Las fotos son gratuitas para uso comercial (con atribución)

## 🐛 **Solución de Problemas**

### Error: "PEXELS_API_KEY no está configurada"
- Verifica que la variable de entorno `PEXELS_API_KEY` esté configurada
- En desarrollo local, asegúrate de tener un archivo `.env` con la clave
- En producción (Render), añade la variable en el panel de configuración

### Error 401: Unauthorized
- Verifica que tu API Key sea correcta
- Asegúrate de que la API Key no haya expirado

### Error 429: Too Many Requests
- Has excedido el límite de solicitudes por hora
- Espera un momento antes de hacer más solicitudes
- Considera actualizar a un plan premium si necesitas más solicitudes

## 📚 **Recursos Adicionales**

- [Documentación oficial de Pexels API](https://www.pexels.com/api/documentation/)
- [Guía de integración con Unsplash](./UNSPLASH_INTEGRATION_GUIDE.md)

## ✅ **Checklist de Implementación**

- [x] Modelo de datos actualizado para soportar Pexels
- [x] Servicio Pexels creado
- [x] Endpoints de búsqueda implementados
- [x] Endpoint de guardado actualizado para soportar ambas fuentes
- [ ] Componente frontend actualizado (opcional)
- [ ] Pruebas de integración

---

**Nota**: Esta integración complementa la existente con Unsplash. Puedes usar ambas APIs según tus necesidades.

