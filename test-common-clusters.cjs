const mongoose = require('mongoose');
require('dotenv').config();

async function testCommonClusters() {
  // Nombres de cluster comunes en MongoDB Atlas
  const clusterNames = [
    'cluster0',
    'cluster1', 
    'cluster2',
    'cluster3',
    'cluster4',
    'cluster5',
    'cluster6',
    'cluster7',
    'cluster8',
    'cluster9',
    'cluster10',
    'cluster11',
    'cluster12',
    'cluster13',
    'cluster14',
    'cluster15',
    'cluster16',
    'cluster17',
    'cluster18',
    'cluster19',
    'cluster20',
    'cluster21',
    'cluster22',
    'cluster23',
    'cluster24',
    'cluster25',
    'cluster26',
    'cluster27',
    'cluster28',
    'cluster29',
    'cluster30',
    'cluster31',
    'cluster32',
    'cluster33',
    'cluster34',
    'cluster35',
    'cluster36',
    'cluster37',
    'cluster38',
    'cluster39',
    'cluster40',
    'cluster41',
    'cluster42',
    'cluster43',
    'cluster44',
    'cluster45',
    'cluster46',
    'cluster47',
    'cluster48',
    'cluster49',
    'cluster50'
  ];

  for (let i = 0; i < clusterNames.length; i++) {
    const clusterName = clusterNames[i];
    const uri = `mongodb+srv://alvaroserr:alvaro123@${clusterName}.mongodb.net/trastalia?retryWrites=true&w=majority`;
    
    console.log(`\n🔗 Probando cluster ${i + 1}/${clusterNames.length}: ${clusterName}`);
    
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
      
      console.log('✅ ¡Conexión exitosa!');
      console.log(`🎯 Cluster encontrado: ${clusterName}`);
      
      // Probar operaciones básicas
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log(`📊 Colecciones encontradas: ${collections.length}`);
      
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
      
      // Probar una consulta simple
      const testCollection = db.collection('users');
      const userCount = await testCollection.countDocuments();
      console.log(`👥 Usuarios en la base de datos: ${userCount}`);
      
      await mongoose.disconnect();
      console.log('📡 Conexión cerrada');
      
      // Guardar el connection string correcto
      console.log(`\n🎉 ¡CONNECTION STRING CORRECTO ENCONTRADO!`);
      console.log(`📋 URI: ${uri}`);
      
      return true;
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n❌ No se pudo conectar con ningún cluster');
  return false;
}

testCommonClusters();
