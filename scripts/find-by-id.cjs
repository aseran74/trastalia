require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function findById() {
  try {
    await mongoose.connect(MONGODB_URI);
    mongoose.connection.useDb('trastalia');
    const db = mongoose.connection.db;
    
    const photoIds = [
      '69296daa593b4aa73b43b9a3',
      '69296daa593b4aa73b43b9a7',
      '69296dab593b4aa73b43b9ab'
    ];
    
    for (const id of photoIds) {
      const photo = await db.collection('articlephotos').findOne({ 
        _id: new mongoose.Types.ObjectId(id) 
      });
      
      if (photo) {
        console.log(`✅ Foto encontrada: ${id}`);
        console.log(`   Source: ${photo.source}`);
        console.log(`   PhotoId: ${photo.photoId}`);
        console.log(`   ArticleId: ${photo.articleId}`);
      } else {
        console.log(`❌ Foto no encontrada: ${id}`);
      }
    }
    
    // Contar todas las fotos
    const total = await db.collection('articlephotos').countDocuments();
    console.log(`\n📊 Total de fotos en la colección: ${total}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

findById();

