require('dotenv').config();
const mongoose = require('mongoose');
const ArticlePhoto = require('../server/models/ArticlePhoto.cjs');

const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function checkPhotos() {
  try {
    const articleId = process.argv[2] || '68d2791440cb2cd8fe2bbed0';
    
    await mongoose.connect(MONGODB_URI);
    
    // Probar en ambas bases de datos
    const dbs = ['trastalia', 'test'];
    let foundPhotos = [];
    let foundDb = null;
    
    for (const dbName of dbs) {
      mongoose.connection.useDb(dbName);
      const photos = await ArticlePhoto.find({ articleId: new mongoose.Types.ObjectId(articleId) }).sort({ isPrimary: -1, createdAt: -1 });
      if (photos.length > 0) {
        console.log(`✅ Encontradas ${photos.length} fotos en base de datos: ${dbName}\n`);
        foundPhotos = photos;
        foundDb = dbName;
        break;
      }
    }
    
    if (foundPhotos.length === 0) {
      // Intentar sin convertir a ObjectId y buscar directamente en la colección
      mongoose.connection.useDb('trastalia');
      const db = mongoose.connection.db;
      const directPhotos = await db.collection('articlephotos').find({ 
        articleId: new mongoose.Types.ObjectId(articleId) 
      }).toArray();
      
      if (directPhotos.length > 0) {
        console.log(`✅ Encontradas ${directPhotos.length} fotos directamente en la colección\n`);
        foundPhotos = directPhotos;
        foundDb = 'trastalia (directo)';
      }
    }
    
    console.log(`📸 Fotos del artículo ${articleId}:`);
    console.log(`Base de datos: ${foundDb || 'No encontradas'}`);
    console.log(`Total: ${foundPhotos.length}\n`);
    
    if (foundPhotos.length > 0) {
      foundPhotos.forEach((photo, i) => {
        const primary = photo.isPrimary ? ' ⭐ PRINCIPAL' : '';
        const source = photo.source || 'N/A';
        const photoId = photo.photoId || photo._id;
        const url = photo.url || 'N/A';
        const photographer = photo.photographer?.name || 'N/A';
        const category = photo.category || 'N/A';
        
        console.log(`${i + 1}. ${source.toUpperCase()} - ID: ${photoId}${primary}`);
        console.log(`   URL: ${url.substring(0, 60)}...`);
        console.log(`   Fotógrafo: ${photographer}`);
        console.log(`   Categoría: ${category}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No se encontraron fotos para este artículo');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

checkPhotos();
