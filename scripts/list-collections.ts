#!/usr/bin/env tsx

import mongoose from 'mongoose';

// URI de MongoDB Atlas - misma que el servidor principal
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

const listCollections = async () => {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    console.log('📍 Base de datos: trastalia\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado exitosamente\n');

    // Obtener la base de datos
    const db = mongoose.connection.db;
    
    // Listar colecciones
    console.log('📁 Colecciones en la base de datos:');
    console.log('─'.repeat(50));
    
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('  ❌ No hay colecciones en esta base de datos');
    } else {
      // Mostrar información detallada de cada colección
      for (const collection of collections) {
        const collectionName = collection.name;
        const count = await db.collection(collectionName).countDocuments();
        
        console.log(`\n📋 ${collectionName}`);
        console.log(`   📊 Documentos: ${count.toLocaleString()}`);
        
        // Obtener índices
        try {
          const indexes = await db.collection(collectionName).indexes();
          console.log(`   🔍 Índices: ${indexes.length}`);
        } catch (e) {
          // Ignorar errores al obtener índices
        }
      }
    }

    console.log('\n' + '─'.repeat(50));
    console.log(`\n✅ Total de colecciones: ${collections.length}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('authentication')) {
      console.error('\n💡 Verifica las credenciales de MongoDB');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Verifica tu conexión a internet');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Desconectado de MongoDB');
    }
    process.exit(0);
  }
};

listCollections();

