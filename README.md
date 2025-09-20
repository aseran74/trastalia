# 🚀 Trastalia - Plataforma de Compraventa

Una plataforma moderna de compraventa de artículos de segunda mano con sistema de puntos y centros logísticos.

## ✨ Características

- 🛒 **Compraventa de Artículos**: Sistema completo de compra y venta
- ⭐ **Sistema de Puntos**: Acumula y canjea puntos por artículos
- 🏢 **Centros Logísticos**: Gestión de almacenes y distribución
- 👨‍💼 **Panel de Administración**: Gestión completa de artículos y usuarios
- 📱 **Diseño Responsivo**: Optimizado para móviles y escritorio
- 🔐 **Autenticación Segura**: Sistema de login con roles de usuario
- 🎨 **UI Moderna**: Interfaz elegante con Tailwind CSS
- 🔔 **Notificaciones Toast**: Sistema de notificaciones no intrusivo

## 🏗️ Arquitectura

### Frontend
- **Vue.js 3** con Composition API
- **Tailwind CSS** para estilos
- **Pinia** para gestión de estado
- **Vue Router** para navegación
- **TypeScript** para tipado

### Backend
- **Node.js** con Express
- **MongoDB Atlas** como base de datos
- **Mongoose** como ODM
- **JWT** para autenticación

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- MongoDB Atlas (cuenta gratuita)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/aseran74/trastalia.git
cd trastalia
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/trastalia?retryWrites=true&w=majority

# Google Places API (opcional)
VITE_GOOGLE_PLACES_API_KEY=tu_api_key_aqui

# Vercel (para deployment)
VERCEL_URL=tu_dominio_vercel
```

### 4. Ejecutar en Desarrollo
```bash
# Iniciar servidor backend
node server/working-server.cjs

# En otra terminal, iniciar frontend
npm run dev
```

### 5. Acceder a la Aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002/api
- **Panel Admin**: http://localhost:5173/admin/articles

## 🔑 Credenciales por Defecto

### Administrador
- **Email**: admin@trastalia.com
- **Password**: admin123456

### Usuario de Prueba
- **Email**: carlos@example.com
- **Password**: carlos123

## 📱 Funcionalidades Principales

### Para Usuarios
- **Vender Artículos**: Publicar artículos con múltiples opciones de venta
- **Comprar Artículos**: Explorar y comprar artículos disponibles
- **Sistema de Puntos**: Acumular puntos por ventas y canjear por artículos
- **Solicitudes de Compra**: Gestionar ofertas de Trastalia
- **Mis Canjes**: Ver historial de intercambios por puntos
- **Artículos Vendidos**: Seguimiento de ventas realizadas

### Para Administradores
- **Gestión de Artículos**: Aprobar/rechazar artículos publicados
- **Ofertas de Compra**: Enviar ofertas de dinero o puntos
- **Centros Logísticos**: Gestionar almacenes y distribución
- **Estadísticas**: Dashboard con métricas del sistema

## 🎨 Tecnologías Utilizadas

### Frontend
- Vue.js 3
- TypeScript
- Tailwind CSS
- Pinia
- Vue Router
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

### Herramientas
- Git
- GitHub
- Vercel (deployment)
- MongoDB Atlas

## 🚀 Deployment en Vercel

### 1. Preparar para Vercel
El proyecto ya incluye configuración para Vercel con:
- `vercel.json` configurado
- Variables de entorno preparadas
- Build optimizado

### 2. Conectar con Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configurar Variables de Entorno en Vercel
En el dashboard de Vercel, agregar:
- `MONGODB_URI`
- `VITE_GOOGLE_PLACES_API_KEY` (opcional)

## 📊 Estructura del Proyecto

```
trastalia/
├── public/                 # Archivos estáticos
├── src/                    # Código fuente frontend
│   ├── components/         # Componentes Vue
│   ├── views/             # Páginas principales
│   ├── stores/            # Estado Pinia
│   ├── router/            # Configuración de rutas
│   └── composables/       # Lógica reutilizable
├── server/                # Backend Node.js
│   └── working-server.cjs # Servidor principal
├── vercel.json           # Configuración Vercel
├── package.json          # Dependencias
└── README.md            # Este archivo
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **GitHub**: [@aseran74](https://github.com/aseran74)
- **Proyecto**: [Trastalia](https://github.com/aseran74/trastalia)

## 🙏 Agradecimientos

- Vue.js Team por el excelente framework
- Tailwind CSS por el sistema de diseño
- MongoDB Atlas por la base de datos en la nube
- Vercel por la plataforma de deployment

---

⭐ **¡No olvides dar una estrella al proyecto si te gusta!**