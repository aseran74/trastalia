require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

async function test() {
  try {
    // Conectar y especificar explícitamente la base de datos
    await mongoose.connect(MONGODB_URI);
    // Forzar el uso de la base de datos 'trastalia'
    mongoose.connection.useDb('trastalia');
    const db = mongoose.connection.db;
    
    console.log(`Base de datos: ${db.databaseName}`);
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log(`\nColecciones disponibles: ${collections.map(c => c.name).join(', ')}`);
    
    // Probar con diferentes nombres posibles
    const possibleNames = ['articles', 'article', 'articulos'];
    
    for (const name of possibleNames) {
      try {
        const count = await db.collection(name).countDocuments();
        if (count > 0) {
          console.log(`\n✅ Colección "${name}" tiene ${count} documentos`);
          const articles = await db.collection(name).find({}).limit(2).toArray();
          articles.forEach((art, i) => {
            console.log(`\n  ${i + 1}. ID: ${art._id}`);
            console.log(`     Campos: ${Object.keys(art).slice(0, 10).join(', ')}...`);
            if (art.nombre) console.log(`     Nombre: ${art.nombre}`);
            if (art.title) console.log(`     Title: ${art.title}`);
            if (art.categoria) console.log(`     Categoría: ${art.categoria}`);
          });
        }
      } catch (e) {
        // Colección no existe
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
  }
}

test();

