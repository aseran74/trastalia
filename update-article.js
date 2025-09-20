const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect('mongodb+srv://mikabodea:Mika1974&@cluster0.zehostg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const articleSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  categoria: String,
  precio_propuesto_vendedor: Number,
  id_vendedor: String,
  estado_articulo: String,
  modo_venta: String,
  opciones_logisticas: [String],
  acepta_descuento_admin: Boolean,
  adminDecision: {
    money: Boolean,
    points: Boolean,
    moneyPrice: Number,
    pointsAmount: Number,
    reject: Boolean,
    selectedOption: String,
    finalPrice: Number,
    finalPoints: Number,
    date: Date
  },
  sellerAccepted: Boolean,
  sellerAcceptedDate: Date
});

const Article = mongoose.model('Article', articleSchema);

async function updateArticle() {
  try {
    const result = await Article.updateOne(
      { _id: '68cea5e83e2dea4053a8beaf' },
      {
        $set: {
          'adminDecision.points': true,
          'adminDecision.pointsAmount': 1500,
          'adminDecision.selectedOption': 'points',
          'adminDecision.finalPoints': 1500,
          'adminDecision.date': new Date(),
          'sellerAccepted': true,
          'sellerAcceptedDate': new Date()
        }
      }
    );
    
    console.log('Artículo actualizado:', result);
    
    // Verificar que se actualizó correctamente
    const article = await Article.findById('68cea5e83e2dea4053a8beaf');
    console.log('Artículo actualizado:', article.adminDecision);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateArticle();
