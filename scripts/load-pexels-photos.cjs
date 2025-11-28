#!/usr/bin/env node

/**
 * Script para cargar fotos de Pexels en MongoDB para artículos
 * 
 * Uso:
 *   node scripts/load-pexels-photos.js <articleId> <category|query> [count]
 * 
 * Ejemplos:
 *   node scripts/load-pexels-photos.js 507f1f77bcf86cd799439011 electronica 5
 *   node scripts/load-pexels-photos.js 507f1f77bcf86cd799439011 smartphone 3
 */

require('dotenv').config();
const mongoose = require('mongoose');
const ArticlePhoto = require('../server/models/ArticlePhoto.cjs');
const pexelsService = require('../server/services/pexelsService.cjs');

// URI de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

// Función principal
async function loadPexelsPhotos() {
  try {
    // Obtener argumentos de la línea de comandos
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log(`
📸 Script para cargar fotos de Pexels en MongoDB

Uso:
  node scripts/load-pexels-photos.js <articleId> <category|query> [count] [--primary]

Argumentos:
  articleId    - ID del artículo en MongoDB
  category     - Categoría o término de búsqueda (ej: electronica, smartphone, ropa)
  count        - Número de fotos a cargar (opcional, default: 5)
  --primary    - Marcar la primera foto como principal (opcional)

Ejemplos:
  node scripts/load-pexels-photos.js 507f1f77bcf86cd799439011 electronica 5
  node scripts/load-pexels-photos.js 507f1f77bcf86cd799439011 smartphone 3 --primary
  node scripts/load-pexels-photos.js 507f1f77bcf86cd799439011 ropa 10

Categorías disponibles:
  electronica, ropa, hogar, deportes, libros, juegos, musica, arte,
  coches, motos, bicicletas, muebles, herramientas, jardineria, mascotas, antigüedades
      `);
      process.exit(1);
    }

    const articleId = args[0];
    const searchTerm = args[1];
    const count = parseInt(args[2]) || 5;
    const setPrimary = args.includes('--primary');

    // Validar articleId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      console.error('❌ Error: El articleId no es un ObjectId válido');
      process.exit(1);
    }

    // Verificar API Key
    if (!process.env.PEXELS_API_KEY) {
      console.error('❌ Error: PEXELS_API_KEY no está configurada en .env');
      process.exit(1);
    }

    console.log('🔌 Conectando a MongoDB...');
    // Asegurar que la URI especifica la base de datos 'trastalia'
    let connectionUri = MONGODB_URI;
    if (!connectionUri.includes('/trastalia') && !connectionUri.includes('/trastalia?')) {
      // Si no especifica la base de datos, añadirla
      connectionUri = connectionUri.replace(/\/[^\/?]*(\?|$)/, '/trastalia$1');
    }
    await mongoose.connect(connectionUri);
    
    const dbName = mongoose.connection.db.databaseName;
    console.log(`✅ Conectado a MongoDB (Base de datos: ${dbName})\n`);
    
    if (dbName !== 'trastalia') {
      console.log(`⚠️  Advertencia: Conectado a "${dbName}" en lugar de "trastalia"`);
      console.log(`   Las fotos se guardarán en "${dbName}"\n`);
    }

    console.log('📋 Parámetros:');
    console.log(`   Article ID: ${articleId}`);
    console.log(`   Búsqueda: ${searchTerm}`);
    console.log(`   Cantidad: ${count}`);
    console.log(`   Foto principal: ${setPrimary ? 'Sí' : 'No'}\n`);

    // Buscar fotos en Pexels
    console.log('🔍 Buscando fotos en Pexels...');
    const searchResult = await pexelsService.searchByCategory(searchTerm, {
      perPage: count,
      page: 1
    });

    if (!searchResult.success) {
      console.error('❌ Error buscando fotos:', searchResult.error);
      await mongoose.disconnect();
      process.exit(1);
    }

    const photos = searchResult.data;
    console.log(`✅ Encontradas ${photos.length} fotos\n`);

    if (photos.length === 0) {
      console.log('⚠️  No se encontraron fotos para la búsqueda');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Verificar si el artículo ya tiene fotos
    const articleIdObj = new mongoose.Types.ObjectId(articleId);
    const existingPhotos = await ArticlePhoto.find({ articleId: articleIdObj });
    const hasPrimary = existingPhotos.some(p => p.isPrimary);
    
    console.log(`📊 Fotos existentes en el artículo: ${existingPhotos.length}`);
    if (hasPrimary) {
      console.log('   Ya tiene foto principal\n');
    } else {
      console.log('   No tiene foto principal\n');
    }

    // Guardar fotos
    let savedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
      try {
        // Verificar si la foto ya existe
        const existing = await ArticlePhoto.findOne({
          source: 'pexels',
          photoId: photo.id,
          articleId: articleIdObj
        });

        if (existing) {
          console.log(`⏭️  Foto ${i + 1}/${photos.length} ya existe (ID: ${photo.id})`);
          skippedCount++;
          continue;
        }

        // Determinar si es principal
        const isPrimary = setPrimary && i === 0 && !hasPrimary;

        // Si es la primera y se marca como principal, desmarcar las otras
        if (isPrimary) {
          await ArticlePhoto.updateMany(
            { articleId, isPrimary: true },
            { isPrimary: false }
          );
        }

        // Crear y guardar la foto
        const articlePhoto = new ArticlePhoto({
          articleId: articleIdObj,
          source: 'pexels',
          pexelsId: parseInt(photo.id),
          photoId: photo.id,
          url: photo.url,
          thumbUrl: photo.thumbUrl,
          altDescription: photo.altDescription || '',
          photographer: photo.photographer,
          dimensions: photo.dimensions,
          color: photo.color || '#000000',
          category: searchTerm,
          tags: photo.tags || [],
          isPrimary
        });

        const saved = await articlePhoto.save();
        savedCount++;
        
        // Verificar que realmente se guardó
        const verify = await ArticlePhoto.findById(saved._id);
        if (!verify) {
          console.error(`⚠️  ADVERTENCIA: La foto se guardó pero no se puede encontrar (ID: ${saved._id})`);
        }
        
        const primaryTag = isPrimary ? ' ⭐ (Principal)' : '';
        console.log(`✅ Foto ${i + 1}/${photos.length} guardada${primaryTag} (ID: ${photo.id})`);
        console.log(`   📝 Guardado con _id: ${saved._id}`);
        console.log(`   📍 Base de datos: ${mongoose.connection.db.databaseName}`);
        console.log(`   📦 Colección: ${ArticlePhoto.collection.name}`);

      } catch (error) {
        if (error.code === 11000) {
          // Duplicado
          console.log(`⏭️  Foto ${i + 1}/${photos.length} duplicada (ID: ${photo.id})`);
          skippedCount++;
        } else {
          console.error(`❌ Error guardando foto ${i + 1}/${photos.length}:`, error.message);
          console.error(`   Error completo:`, error);
        }
      }
    }

    // Resumen
    console.log('\n' + '='.repeat(50));
    console.log('📊 Resumen:');
    console.log(`   ✅ Guardadas: ${savedCount}`);
    console.log(`   ⏭️  Omitidas: ${skippedCount}`);
    console.log(`   📸 Total procesadas: ${photos.length}`);
    console.log('='.repeat(50));

    // Obtener todas las fotos del artículo
    const allPhotos = await ArticlePhoto.find({ articleId }).sort({ isPrimary: -1, createdAt: -1 });
    console.log(`\n📋 Total de fotos en el artículo: ${allPhotos.length}`);
    const primaryPhoto = allPhotos.find(p => p.isPrimary);
    if (primaryPhoto) {
      console.log(`⭐ Foto principal: ${primaryPhoto.source} - ${primaryPhoto.photoId}`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Proceso completado');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Ejecutar
loadPexelsPhotos();

