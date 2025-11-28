require('dotenv').config();
const mongoose = require('mongoose');
const ArticlePhoto = require('../server/models/ArticlePhoto.cjs');

const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    mongoose.connection.useDb('trastalia');
    
    console.log('Nombre de colección del modelo:', ArticlePhoto.collection.name);
    console.log('Base de datos:', mongoose.connection.db.databaseName);
    
    const articleId = '68d2791440cb2cd8fe2bbed0';
    const photos = await ArticlePhoto.find({ articleId: new mongoose.Types.ObjectId(articleId) });
    
    console.log(`\nFotos encontradas con el modelo: ${photos.length}`);
    
    if (photos.length > 0) {
      photos.forEach((p, i) => {
        console.log(`${i + 1}. ${p.source} - ${p.photoId}`);
      });
    }
    
    // Verificar directamente en la colección
    const db = mongoose.connection.db;
    const collectionName = ArticlePhoto.collection.name;
    const directPhotos = await db.collection(collectionName).find({ 
      articleId: new mongoose.Types.ObjectId(articleId) 
    }).toArray();
    
    console.log(`\nFotos encontradas directamente en colección "${collectionName}": ${directPhotos.length}`);
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log(`\nColecciones disponibles:`);
    collections.forEach(c => {
      if (c.name.includes('photo') || c.name.includes('Photo')) {
        console.log(`  - ${c.name}`);
      }
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

check();

