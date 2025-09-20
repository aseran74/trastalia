import mongoose from 'mongoose';

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea_db_user:Mika1974%26@cluster0.zehostg.mongodb.net/tailadmin?retryWrites=true&w=majority&appName=Cluster0';

async function updateArticles() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Definir el esquema de Article
    const articleSchema = new mongoose.Schema({
      title: String,
      isForSale: Boolean,
      isForExchange: Boolean,
      wantsPoints: Boolean,
      wantsDirectExchange: Boolean
    }, { collection: 'articles' });

    const Article = mongoose.model('Article', articleSchema);

    // Artículos que solo se venden por dinero
    const articlesOnlyMoney = [
      'iPhone 13 Pro Max 256GB - Azul Sierra',
      'MacBook Air M1 13" - Gris Espacial', 
      'Nintendo Switch OLED - Blanco',
      'Samsung Galaxy S22 Ultra 512GB - Negro',
      'iPad Pro 12.9" M2 - Gris Espacial',
      'PlayStation 5 + 3 Juegos',
      'Apple Watch Series 8 45mm - Azul Medianoche',
      'Cámara Canon EOS R6 Mark II + Objetivo 24-70mm',
      'Bicicleta Eléctrica Trek Powerfly 7',
      'Sofá Chesterfield de Cuero Genuino',
      'Guitarra Fender Stratocaster American Professional II',
      'Kit de Herramientas Profesionales Bosch'
    ];

    // Artículos que se venden por dinero Y por intercambio
    const articlesWithExchange = [
      'Sony PlayStation 5 + 2 Mandos DualSense',
      'DJI Mavic 3 Pro + 3 Baterías',
      'Colección Completa de Cómics Marvel (2015-2020)',
      'Reloj Rolex Submariner Date 116610LN'
    ];

    console.log('🔄 Actualizando artículos solo para compra...');
    const updateOnlyMoney = await Article.updateMany(
      { title: { $in: articlesOnlyMoney } },
      { 
        $set: { 
          isForSale: true, 
          isForExchange: false, 
          wantsPoints: false, 
          wantsDirectExchange: false 
        } 
      }
    );
    console.log(`✅ Actualizados ${updateOnlyMoney.modifiedCount} artículos solo para compra`);

    console.log('🔄 Actualizando artículos con intercambio...');
    const updateWithExchange = await Article.updateMany(
      { title: { $in: articlesWithExchange } },
      { 
        $set: { 
          isForSale: true, 
          isForExchange: true, 
          wantsPoints: true, 
          wantsDirectExchange: true 
        } 
      }
    );
    console.log(`✅ Actualizados ${updateWithExchange.modifiedCount} artículos con intercambio`);

    console.log('🎉 Actualización completada exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Desconectado de MongoDB');
  }
}

updateArticles();
