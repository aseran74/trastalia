import mongoose from 'mongoose';

// Conectar a MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://trastalia_user:E8wlpttDBlCqY7cn@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
    process.exit(1);
  }
};

const checkCollections = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Colecciones en la base de datos:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });

    // Verificar colección de artículos
    const articlesCollection = db.collection('articles');
    const articleCount = await articlesCollection.countDocuments();
    console.log(`\n📊 Artículos en la colección: ${articleCount}`);

    if (articleCount > 0) {
      console.log('\n📝 Primeros 3 artículos:');
      const articles = await articlesCollection.find({}).limit(3).toArray();
      articles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} - ${article.price}€`);
      });
    }

    // Verificar colección de usuarios
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`\n👥 Usuarios en la colección: ${userCount}`);

    if (userCount > 0) {
      console.log('\n👤 Primeros 3 usuarios:');
      const users = await usersCollection.find({}).limit(3).toArray();
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - ${user.email}`);
      });
    }

    // Verificar la base de datos actual
    console.log(`\n🗄️ Base de datos actual: ${db.databaseName}`);

  } catch (error) {
    console.error('❌ Error verificando colecciones:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Conexión cerrada');
  }
};

// Ejecutar el script
const run = async () => {
  await connectDB();
  await checkCollections();
};

run();





