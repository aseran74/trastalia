const Stripe = require('stripe');

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Webhook de Stripe para Vercel
 * Endpoint: /api/stripe/webhook
 */
export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Construir el evento verificando la firma
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📨 Webhook recibido:', event.type);

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('✅ Pago completado:', session.id);
      
      const { userId, articleIds, type } = session.metadata || {};
      console.log('👤 Usuario:', userId);
      console.log('📦 Artículos:', articleIds);
      console.log('🔍 Tipo:', type);
      
      try {
        // Importar MongoDB connection
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI);
        
        await client.connect();
        const db = client.db();
        
        // Verificar si es compra de puntos
        if (type === 'points_purchase') {
          console.log('⭐ Procesando compra de puntos...');
          
          const pointsAmount = parseInt(session.metadata.pointsAmount) || 0;
          const bonusPoints = parseInt(session.metadata.bonusPoints) || 0;
          const totalPoints = pointsAmount + bonusPoints;
          
          // Actualizar puntos del usuario
          await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { 
              $inc: { points: totalPoints },
              $set: { 
                lastPointsPurchase: new Date(),
                lastPointsAmount: totalPoints
              }
            }
          );
          
          // Registrar la compra de puntos en user_purchases
          await db.collection('user_purchases').insertOne({
            userId: new ObjectId(userId),
            type: 'points_purchase',
            amount: session.amount_total / 100,
            pointsAmount: pointsAmount,
            bonusPoints: bonusPoints,
            totalPoints: totalPoints,
            currency: session.currency,
            paymentMethod: 'stripe_checkout',
            stripeSessionId: session.id,
            status: 'completed',
            shippingCost: 0,
            totalCost: session.amount_total / 100,
            createdAt: new Date()
          });
          
          console.log(`✅ ${totalPoints} puntos añadidos al usuario ${userId}`);
          
        } else {
          // Procesar compra de artículos
          console.log('📦 Procesando compra de artículos...');
          
          // Si articleIds es un string separado por comas, convertir a array
          const articleIdArray = articleIds ? articleIds.split(',') : [];
          
          // Actualizar cada artículo como vendido
          for (const articleId of articleIdArray) {
            await db.collection('articles').updateOne(
              { _id: new ObjectId(articleId) },
              { 
                $set: { 
                  status: 'sold',
                  estado: 'vendido',
                  sold: true,
                  buyer: new ObjectId(userId),
                  soldAt: new Date(),
                  paymentMethod: 'stripe_checkout',
                  stripeSessionId: session.id,
                  paidAmount: session.amount_total / 100,
                  currency: session.currency
                }
              }
            );
            console.log(`✅ Artículo ${articleId} marcado como vendido`);
          }
          
          // Calcular gastos de envío según el tipo de paquete
          let shippingCost = 0;
          let packageType = 'individual';
          
          // Obtener información de los artículos para determinar el tipo de paquete
          const articles = await db.collection('articles').find({
            _id: { $in: articleIdArray.map(id => new ObjectId(id)) }
          }).toArray();
          
          // Determinar si es un paquete completo
          const totalValue = articles.reduce((sum, article) => sum + (article.price || 0), 0);
          
          if (totalValue >= 1000) {
            packageType = 'premium';
            shippingCost = 25; // Envío premium
          } else if (totalValue >= 500) {
            packageType = 'standard';
            shippingCost = 15; // Envío estándar
          } else {
            packageType = 'basic';
            shippingCost = 8; // Envío básico
          }
          
          const totalCost = (session.amount_total / 100) + shippingCost;
          
          // Registrar la transacción en user_purchases
          await db.collection('user_purchases').insertOne({
            userId: new ObjectId(userId),
            type: 'article_purchase',
            articleIds: articleIdArray.map(id => new ObjectId(id)),
            amount: session.amount_total / 100,
            currency: session.currency,
            paymentMethod: 'stripe_checkout',
            stripeSessionId: session.id,
            status: 'completed',
            shippingCost: shippingCost,
            totalCost: totalCost,
            packageType: packageType,
            createdAt: new Date()
          });
          
          console.log('✅ Transacción registrada en MongoDB');
        }
        
        await client.close();
        
      } catch (error) {
        console.error('❌ Error actualizando base de datos:', error);
        // Aunque falle la actualización de BD, Stripe ya procesó el pago
        // Es importante responder 200 para evitar reintentos
      }
      
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('💰 PaymentIntent completado:', paymentIntent.id);
      console.log('💰 Metadata:', paymentIntent.metadata);
      
      // Si usas Payment Intents directamente (no Checkout Sessions)
      if (paymentIntent.metadata && paymentIntent.metadata.articleId) {
        try {
          const { MongoClient, ObjectId } = require('mongodb');
          const client = new MongoClient(process.env.MONGODB_URI);
          
          await client.connect();
          const db = client.db();
          
          const articleId = paymentIntent.metadata.articleId;
          const userId = paymentIntent.metadata.userId;
          
          await db.collection('articles').updateOne(
            { _id: new ObjectId(articleId) },
            { 
              $set: { 
                status: 'sold',
                estado: 'vendido',
                sold: true,
                buyer: new ObjectId(userId),
                soldAt: new Date(),
                paymentMethod: 'stripe_payment_intent',
                stripePaymentIntentId: paymentIntent.id,
                paidAmount: paymentIntent.amount / 100,
                currency: paymentIntent.currency
              }
            }
          );
          
          console.log(`✅ Artículo ${articleId} marcado como vendido (Payment Intent)`);
          
          await client.close();
        } catch (error) {
          console.error('❌ Error actualizando artículo:', error);
        }
      }
      
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.error('❌ Pago fallido:', paymentIntent.id);
      console.error('❌ Razón:', paymentIntent.last_payment_error?.message);
      
      // TODO: Notificar al usuario del fallo
      
      break;
    }
    
    default:
      console.log(`ℹ️ Evento no manejado: ${event.type}`);
  }

  // Responder con éxito para evitar reintentos
  res.json({ received: true });
}
