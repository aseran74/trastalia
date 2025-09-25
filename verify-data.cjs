const mongoose = require('mongoose');

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    verifyData();
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

async function verifyData() {
  try {
    const userId = '68cd4472601315508398cd51';

    console.log('🔍 Verificando usuario:');
    const user = await User.findById(userId);
    console.log('👤 Usuario:', { name: user.name, points: user.points });

    console.log('\n🔍 Verificando artículos disponibles (sin comprador):');
    const availableArticles = await Article.find({
      estado_articulo: 'COMPRADO_POR_ADMIN',
      comprador: { $exists: false }
    });
    console.log('📋 Total disponibles:', availableArticles.length);
    console.log('📋 Primeros 3:', availableArticles.slice(0, 3).map(a => ({ 
      id: a._id, 
      nombre: a.nombre, 
      estado: a.estado_articulo,
      comprador: a.comprador 
    })));

    console.log('\n🔍 Verificando canjes del usuario:');
    const userExchanges = await Article.find({
      comprador: userId,
      comprador_tipo: 'usuario',
      estado_articulo: 'VENDIDO_A_TRASTALIA_PUNTOS'
    });
    console.log('🔄 Total canjes:', userExchanges.length);
    console.log('🔄 Canjes:', userExchanges.map(a => ({ 
      id: a._id, 
      nombre: a.nombre, 
      estado: a.estado_articulo,
      comprador: a.comprador,
      finalPoints: a.adminDecision?.finalPoints
    })));

  } catch (error) {
    console.error('❌ Error verificando datos:', error);
  } finally {
    mongoose.connection.close();
  }
}
