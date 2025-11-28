require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function findPhotos() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Probar en ambas bases de datos
    const dbs = ['trastalia', 'test'];
    
    for (const dbName of dbs) {
      mongoose.connection.useDb(dbName);
      const db = mongoose.connection.db;
      
      const photos = await db.collection('articlephotos').find({}).limit(5).toArray();
      console.log(`\n📸 Base de datos: ${dbName}`);
      console.log(`   Total fotos: ${await db.collection('articlephotos').countDocuments()}`);
      
      if (photos.length > 0) {
        photos.forEach((photo, i) => {
          console.log(`   ${i + 1}. ${photo.source} - ${photo.photoId} - Artículo: ${photo.articleId}`);
        });
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

findPhotos();

