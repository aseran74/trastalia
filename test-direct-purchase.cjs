const mongoose = require('mongoose');

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    testDirectPurchase();
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// Esquemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  points: { type: Number, default: 0 }
}, { timestamps: true });

const ArticleSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  categoria: String,
  precio_propuesto_vendedor: Number,
  id_vendedor: mongoose.Schema.Types.ObjectId,
  estado_articulo: String,
  adminDecision: {
    money: Boolean,
    points: Boolean,
    moneyPrice: Number,
    pointsAmount: Number,
    selectedOption: String,
    finalPoints: Number
  },
  comprador: mongoose.Schema.Types.ObjectId,
  comprador_tipo: String,
  sellerAccepted: Boolean,
  sellerAcceptedDate: Date
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Article = mongoose.model('Article', ArticleSchema);

async function testDirectPurchase() {
  try {
    const userId = '68cd4472601315508398cd51';
    const articleId = '68d3c07df8cbb79d52499d89';
    const pointsAmount = 50;

    console.log('🔍 Buscando usuario:', userId);
    const user = await User.findById(userId);
    console.log('👤 Usuario encontrado:', { name: user.name, points: user.points });

    console.log('🔍 Buscando artículo:', articleId);
    const article = await Article.findById(articleId);
    console.log('📦 Artículo encontrado:', { 
      nombre: article.nombre, 
      estado: article.estado_articulo,
      adminDecision: article.adminDecision 
    });

    if (user.points < pointsAmount) {
      console.log('❌ Usuario no tiene suficientes puntos:', user.points, '<', pointsAmount);
      return;
    }

    if (!article.adminDecision?.points) {
      console.log('❌ Artículo no disponible para compra con puntos');
      return;
    }

    // Actualizar el artículo
    article.estado_articulo = 'VENDIDO_A_TRASTALIA_PUNTOS';
    article.comprador = userId;
    article.comprador_tipo = 'usuario';
    article.adminDecision.selectedOption = 'points';
    article.adminDecision.finalPoints = pointsAmount;
    article.sellerAccepted = true;
    article.sellerAcceptedDate = new Date();
    article.updatedAt = new Date();

    // Restar puntos al usuario
    user.points -= pointsAmount;
    user.updatedAt = new Date();

    // Guardar cambios
    await article.save();
    await user.save();

    console.log('✅ Compra realizada con éxito:');
    console.log('📦 Artículo actualizado:', {
      estado: article.estado_articulo,
      comprador: article.comprador,
      comprador_tipo: article.comprador_tipo
    });
    console.log('👤 Usuario actualizado:', {
      puntos_restantes: user.points
    });

    // Verificar que el artículo ya no aparece en disponibles
    const availableArticles = await Article.find({
      estado_articulo: 'COMPRADO_POR_ADMIN',
      comprador: { $exists: false }
    });
    console.log('📋 Artículos disponibles:', availableArticles.length);

    // Verificar que aparece en canjes del usuario
    const userExchanges = await Article.find({
      comprador: userId,
      comprador_tipo: 'usuario',
      estado_articulo: 'VENDIDO_A_TRASTALIA_PUNTOS'
    });
    console.log('🔄 Canjes del usuario:', userExchanges.length);

  } catch (error) {
    console.error('❌ Error en compra directa:', error);
  } finally {
    mongoose.connection.close();
  }
}
