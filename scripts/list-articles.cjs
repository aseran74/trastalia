#!/usr/bin/env node

/**
 * Script para listar artículos y sus IDs
 * Útil para obtener el ID del artículo antes de cargar fotos
 */

require('dotenv').config();
const mongoose = require('mongoose');

// URI de MongoDB - asegurar que use la base de datos 'trastalia'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

// Verificar que la URI incluya el nombre de la base de datos
if (!MONGODB_URI.includes('/trastalia')) {
  console.error('⚠️  Advertencia: La URI de MongoDB no especifica la base de datos "trastalia"');
}

async function listArticles() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    // Forzar el uso de la base de datos 'trastalia'
    mongoose.connection.useDb('trastalia');
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`✅ Conectado a MongoDB (Base de datos: ${dbName})\n`);

    const limit = parseInt(process.argv[2]) || 20;
    const articlesCollection = db.collection('articles');
    
    // Buscar artículos directamente
    const articles = await articlesCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    if (articles.length === 0) {
      console.log('⚠️  No se encontraron artículos');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`📋 Artículos encontrados (mostrando ${articles.length}):\n`);
    console.log('─'.repeat(80));
    
    articles.forEach((article, index) => {
      // Intentar obtener el nombre de diferentes campos posibles
      const name = article.nombre || article.title || article.descripcion?.substring(0, 50) || 'Sin nombre';
      const category = article.categoria || article.category || 'Sin categoría';
      const status = article.estado_articulo || article.status || article.estado || 'Sin estado';
      const price = article.precio_propuesto_vendedor || article.precio_sugerido || article.price || 'N/A';
      
      console.log(`${index + 1}. ${name}`);
      console.log(`   ID: ${article._id}`);
      console.log(`   Categoría: ${category}`);
      console.log(`   Estado: ${status}`);
      console.log(`   Precio: ${price}`);
      console.log('');
    });

    console.log('─'.repeat(80));
    console.log(`\n💡 Para cargar fotos de Pexels, usa:`);
    console.log(`   npm run load-pexels <articleId> <category> [count]`);
    console.log(`   Ejemplo: npm run load-pexels ${articles[0]._id} electronica 5\n`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

listArticles();

