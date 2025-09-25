const mongoose = require('mongoose');

// Conectar a MongoDB
const MONGODB_URI = 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    addPoints();
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

const User = mongoose.model('User', UserSchema);

async function addPoints() {
  try {
    const userId = '68cd4472601315508398cd51';
    
    console.log('🔍 Buscando usuario:', userId);
    const user = await User.findById(userId);
    console.log('👤 Usuario encontrado:', { name: user.name, points: user.points });

    // Agregar 200 puntos
    user.points += 200;
    await user.save();

    console.log('✅ Puntos agregados:', { 
      puntos_anteriores: user.points - 200, 
      puntos_nuevos: user.points 
    });

  } catch (error) {
    console.error('❌ Error agregando puntos:', error);
  } finally {
    mongoose.connection.close();
  }
}
