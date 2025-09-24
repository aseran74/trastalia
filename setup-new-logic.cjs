const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function setupNewLogic() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Definir esquemas
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, default: 'user' },
      avatar: String,
      isActive: { type: Boolean, default: true },
      lastLogin: Date,
      points: { type: Number, default: 0 },
      logisticsLevel: String,
      reputation: { type: Number, default: 0 }
    }, { timestamps: true });

    const ArticleSchema = new mongoose.Schema({
      nombre: { type: String, required: true },
      descripcion: { type: String, required: true },
      categoria: { type: String, required: true },
      precio_sugerido: { type: Number, required: true },
      condicion: { type: String, required: true },
      ubicacion: { type: String, required: true },
      fotos: [String],
      tags: [String],
      views: { type: Number, default: 0 },
      vendedor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      comprador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      ubicacion_venta: {
        type: String,
        enum: ['casa', 'centro_logistico'],
        required: true
      },
      estado: {
        type: String,
        enum: [
          'en_venta',
          'solicitud_compra_pendiente',
          'vendido_a_comprador',
          'vendido_a_admin_dinero',
          'vendido_a_admin_puntos',
          'rechazado_por_admin',
          'rechazado_por_vendedor'
        ],
        default: 'en_venta'
      },
      gastos_envio_logistico_pagados_por: {
        type: String,
        enum: ['vendedor', 'comprador', 'admin'],
        default: 'vendedor'
      },
      precio_envio_logistico: { type: Number, default: 0 },
      gasto_envio_comprador_por: {
        type: String,
        enum: ['comprador_vendedor', 'venta_logistico', 'compra_empresa'],
        default: 'comprador_vendedor'
      },
      precio_envio_comprador: { type: Number, default: 0 },
      oferta_admin: {
        precio_ofertado: Number,
        puntos_ofertados: Number,
        tipo_oferta: {
          type: String,
          enum: ['dinero', 'puntos', 'ambos']
        },
        fecha_oferta: Date,
        estado_oferta: {
          type: String,
          enum: ['pendiente', 'aceptada', 'rechazada'],
          default: 'pendiente'
        },
        comentarios: String
      },
      centro_logistico: {
        nombre: String,
        ubicacion: String,
        comision: { type: Number, default: 0.03 },
        costo_almacenamiento: { type: Number, default: 0 }
      }
    }, { timestamps: true });

    const OfertaAdminSchema = new mongoose.Schema({
      articulo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
      admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      precio_ofertado: Number,
      puntos_ofertados: Number,
      tipo_oferta: {
        type: String,
        enum: ['dinero', 'puntos', 'ambos'],
        required: true
      },
      estado_oferta: {
        type: String,
        enum: ['pendiente', 'aceptada', 'rechazada'],
        default: 'pendiente'
      },
      comentarios: String,
      fecha_respuesta: Date,
      respuesta_vendedor: {
        aceptada: Boolean,
        comentarios: String,
        fecha_respuesta: Date
      }
    }, { timestamps: true });

    const CentroLogisticoSchema = new mongoose.Schema({
      nombre: { type: String, required: true },
      ubicacion: { type: String, required: true },
      direccion: String,
      telefono: String,
      email: String,
      capacidad: { type: Number, default: 100 },
      comision: { type: Number, default: 0.03 },
      costo_almacenamiento_diario: { type: Number, default: 5 },
      sectores_cubiertos: [String],
      coordenadas: {
        latitud: { type: Number, required: true },
        longitud: { type: Number, required: true }
      },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const User = mongoose.model('User', UserSchema);
    const Article = mongoose.model('Article', ArticleSchema);
    const OfertaAdmin = mongoose.model('OfertaAdmin', OfertaAdminSchema);
    const CentroLogistico = mongoose.model('CentroLogistico', CentroLogisticoSchema);

    // Limpiar colecciones existentes
    console.log('🧹 Limpiando colecciones existentes...');
    await Article.deleteMany({});
    await OfertaAdmin.deleteMany({});
    await CentroLogistico.deleteMany({});
    console.log('✅ Colecciones limpiadas');

    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    
    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@trastalia.com',
      password: 'admin123456',
      role: 'admin',
      points: 10000,
      logisticsLevel: 'almirante',
      reputation: 1000
    });
    await adminUser.save();

    const user1 = new User({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'juan123',
      role: 'user',
      points: 1500,
      logisticsLevel: 'comerciante',
      reputation: 85
    });
    await user1.save();

    const user2 = new User({
      name: 'María García',
      email: 'maria@example.com',
      password: 'maria123',
      role: 'user',
      points: 2300,
      logisticsLevel: 'experto',
      reputation: 92
    });
    await user2.save();

    console.log('✅ Usuarios creados');

    // Crear centros logísticos
    console.log('🏢 Creando centros logísticos...');
    
    const centro1 = new CentroLogistico({
      nombre: 'Centro Logístico Madrid',
      ubicacion: 'Madrid, España',
      direccion: 'Calle Industrial 123, Madrid',
      telefono: '+34 91 123 4567',
      email: 'madrid@trastalia.com',
      capacidad: 200,
      comision: 0.03,
      costo_almacenamiento_diario: 5,
      sectores_cubiertos: ['Madrid', 'Alcalá de Henares', 'Getafe', 'Leganés'],
      coordenadas: {
        latitud: 40.4168,
        longitud: -3.7038
      }
    });
    await centro1.save();

    const centro2 = new CentroLogistico({
      nombre: 'Centro Logístico Barcelona',
      ubicacion: 'Barcelona, España',
      direccion: 'Avenida Logística 456, Barcelona',
      telefono: '+34 93 987 6543',
      email: 'barcelona@trastalia.com',
      capacidad: 150,
      comision: 0.03,
      costo_almacenamiento_diario: 5,
      sectores_cubiertos: ['Barcelona', 'Badalona', 'Hospitalet', 'Terrassa'],
      coordenadas: {
        latitud: 41.3851,
        longitud: 2.1734
      }
    });
    await centro2.save();

    console.log('✅ Centros logísticos creados');

    // Crear artículos de ejemplo
    console.log('📦 Creando artículos de ejemplo...');
    
    // Artículo 1: Venta desde casa
    const articulo1 = new Article({
      nombre: 'iPhone 13 Pro Max',
      descripcion: 'iPhone 13 Pro Max en excelente estado, 256GB, con funda y cargador original.',
      categoria: 'tecnologia',
      precio_sugerido: 850,
      condicion: 'excelente',
      ubicacion: 'Madrid, España',
      fotos: ['/images/iphone13.jpg'],
      tags: ['iphone', 'apple', 'smartphone'],
      vendedor_id: user1._id,
      ubicacion_venta: 'casa',
      estado: 'en_venta',
      gasto_envio_comprador_por: 'comprador_vendedor',
      precio_envio_comprador: 8.50
    });
    await articulo1.save();

    // Artículo 2: Venta desde centro logístico
    const articulo2 = new Article({
      nombre: 'MacBook Air M1',
      descripcion: 'MacBook Air con chip M1, 8GB RAM, 256GB SSD. Perfecto para trabajo y estudio.',
      categoria: 'tecnologia',
      precio_sugerido: 950,
      condicion: 'excelente',
      ubicacion: 'Barcelona, España',
      fotos: ['/images/macbook.jpg'],
      tags: ['macbook', 'apple', 'laptop'],
      vendedor_id: user2._id,
      ubicacion_venta: 'centro_logistico',
      estado: 'en_venta',
      gastos_envio_logistico_pagados_por: 'vendedor',
      precio_envio_logistico: 12.00,
      centro_logistico: {
        nombre: centro2.nombre,
        ubicacion: centro2.ubicacion,
        comision: centro2.comision,
        costo_almacenamiento: centro2.costo_almacenamiento_diario
      }
    });
    await articulo2.save();

    // Artículo 3: Solicitud de compra pendiente
    const articulo3 = new Article({
      nombre: 'Nintendo Switch OLED',
      descripcion: 'Nintendo Switch OLED modelo 2021, con 2 mandos y 3 juegos incluidos.',
      categoria: 'juegos',
      precio_sugerido: 300,
      condicion: 'bueno',
      ubicacion: 'Valencia, España',
      fotos: ['/images/nintendo.jpg'],
      tags: ['nintendo', 'consola', 'juegos'],
      vendedor_id: user1._id,
      ubicacion_venta: 'centro_logistico',
      estado: 'solicitud_compra_pendiente',
      gastos_envio_logistico_pagados_por: 'admin',
      precio_envio_logistico: 0,
      centro_logistico: {
        nombre: centro1.nombre,
        ubicacion: centro1.ubicacion,
        comision: centro1.comision,
        costo_almacenamiento: centro1.costo_almacenamiento_diario
      }
    });
    await articulo3.save();

    console.log('✅ Artículos de ejemplo creados');

    // Crear oferta de ejemplo
    console.log('💰 Creando oferta de ejemplo...');
    
    const oferta1 = new OfertaAdmin({
      articulo_id: articulo3._id,
      admin_id: adminUser._id,
      precio_ofertado: 250,
      puntos_ofertados: 30000,
      tipo_oferta: 'ambos',
      comentarios: 'Excelente estado, precio justo para el mercado actual.'
    });
    await oferta1.save();

    // Actualizar el artículo con la oferta
    articulo3.oferta_admin = {
      precio_ofertado: 250,
      puntos_ofertados: 30000,
      tipo_oferta: 'ambos',
      fecha_oferta: new Date(),
      estado_oferta: 'pendiente',
      comentarios: 'Excelente estado, precio justo para el mercado actual.'
    };
    await articulo3.save();

    console.log('✅ Oferta de ejemplo creada');

    console.log('\n🎉 ¡Configuración completada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`- ${await User.countDocuments()} usuarios creados`);
    console.log(`- ${await CentroLogistico.countDocuments()} centros logísticos creados`);
    console.log(`- ${await Article.countDocuments()} artículos creados`);
    console.log(`- ${await OfertaAdmin.countDocuments()} ofertas creadas`);
    
    console.log('\n🔑 Credenciales:');
    console.log('Admin: admin@trastalia.com / admin123456');
    console.log('Usuario 1: juan@example.com / juan123');
    console.log('Usuario 2: maria@example.com / maria123');

  } catch (error) {
    console.error('❌ Error en la configuración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

setupNewLogic();
