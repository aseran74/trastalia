require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function verify() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const dbs = ['trastalia', 'test'];
    const articleId = '68d2791440cb2cd8fe2bbed0';
    
    for (const dbName of dbs) {
      mongoose.connection.useDb(dbName);
      const db = mongoose.connection.db;
      
      const count = await db.collection('articlephotos').countDocuments();
      const photos = await db.collection('articlephotos').find({ 
        articleId: new mongoose.Types.ObjectId(articleId) 
      }).toArray();
      
      console.log(`\n📊 Base de datos: ${dbName}`);
      console.log(`   Total fotos en colección: ${count}`);
      console.log(`   Fotos del artículo: ${photos.length}`);
      
      if (photos.length > 0) {
        photos.forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.source} - ${p.photoId} - Principal: ${p.isPrimary || false}`);
        });
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

verify();

