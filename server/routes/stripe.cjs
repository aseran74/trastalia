const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const jwt = require('jsonwebtoken');

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_default_key');

// Middleware de autenticación local (replica del servidor principal)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token no proporcionado'
    });
  }

  const token = authHeader.substring(7);
  
  // Verificar si es token de MongoDB (formato simple)
  if (token.startsWith('mongodb-admin-token-') || token.startsWith('mongodb-user-token-')) {
    console.log('✅ Token de MongoDB aceptado');
    // Para tokens de MongoDB, aceptarlos directamente
    // Nota: En producción, deberías validar estos tokens contra la BD
    req.userId = token.includes('admin') ? '68cd4472601315508398cd50' : token.split('-').pop();
    req.userEmail = 'user@trastalia.com';
    req.userRole = token.includes('admin') ? 'admin' : 'user';
    next();
    return;
  }
  
  // Intentar verificar como JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secreto-super-seguro-2024');
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

/**
 * POST /api/stripe/create-payment-intent-test
 * Crea un Payment Intent SIN autenticación (solo para pruebas)
 */
router.post('/create-payment-intent-test', async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;

    console.log('💳 Creando Payment Intent de PRUEBA (sin auth)');
    console.log('💰 Monto:', amount, currency);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto inválido'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // en centavos
      currency, // "eur" o "usd"
      automatic_payment_methods: { enabled: true },
      metadata: {
        test_mode: 'true'
      }
    });

    console.log('✅ Payment Intent de prueba creado:', paymentIntent.id);

    res.json({ 
      success: true,
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error) {
    console.error('❌ Error creando Payment Intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear Payment Intent',
      error: error.message
    });
  }
});

/**
 * POST /api/stripe/create-payment-intent
 * Crea un Payment Intent (para formulario embebido)
 */
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;
    const userId = req.userId;

    console.log('💳 Creando Payment Intent');
    console.log('👤 Usuario:', userId);
    console.log('💰 Monto:', amount, currency);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto inválido'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // en centavos
      currency, // "eur" o "usd"
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId.toString()
      }
    });

    console.log('✅ Payment Intent creado:', paymentIntent.id);

    res.json({ 
      success: true,
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error) {
    console.error('❌ Error creando Payment Intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear Payment Intent',
      error: error.message
    });
  }
});

/**
 * POST /api/stripe/create-checkout-session
 * Crea una sesión de Stripe Checkout
 */
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.userId;

    console.log('💳 Creando sesión de Stripe Checkout');
    console.log('👤 Usuario:', userId);
    console.log('📦 Items:', items);

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay artículos en el carrito'
      });
    }

    // Construir los line items para Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          description: `Artículo ID: ${item.id}`,
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity || 1,
    }));

    // Crear la sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://trastalia.vercel.app' : 'http://localhost:5173')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://trastalia.vercel.app' : 'http://localhost:5173')}/payment/cancel`,
      metadata: {
        userId: userId.toString(),
        articleIds: items.map(item => item.id || item._id).join(','),
        // Información adicional para el webhook
        itemCount: items.length.toString(),
        timestamp: new Date().toISOString()
      },
      customer_email: req.userEmail, // Si tienes el email en el token
    });

    console.log('✅ Sesión de Stripe creada:', session.id);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('❌ Error creando sesión de Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la sesión de pago',
      error: error.message
    });
  }
});

/**
 * POST /api/stripe/simulate-purchase
 * Simular una compra para probar la actualización de MongoDB
 */
router.post('/simulate-purchase', authMiddleware, async (req, res) => {
  try {
    const { articleId, amount = 100 } = req.body;
    const userId = req.userId;

    console.log('🧪 Simulando compra...');
    console.log('👤 Usuario:', userId);
    console.log('📦 Artículo:', articleId);
    console.log('💰 Monto:', amount);

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'ID de artículo requerido'
      });
    }

    const mongoose = require('mongoose');
    
    // 1. Marcar artículo como vendido
    await mongoose.connection.db.collection('articles').updateOne(
      { _id: new mongoose.Types.ObjectId(articleId) },
      { 
        $set: { 
          status: 'sold',
          estado: 'vendido',
          sold: true,
          buyer: new mongoose.Types.ObjectId(userId),
          soldAt: new Date(),
          paymentMethod: 'stripe_checkout',
          stripeSessionId: 'cs_test_simulated_' + Date.now(),
          paidAmount: amount,
          currency: 'eur'
        }
      }
    );
    
    console.log(`✅ Artículo ${articleId} marcado como vendido`);
    
    // 2. Calcular gastos de envío
    let shippingCost = 0;
    let packageType = 'basic';
    
    if (amount >= 1000) {
      packageType = 'premium';
      shippingCost = 25;
    } else if (amount >= 500) {
      packageType = 'standard';
      shippingCost = 15;
    } else {
      packageType = 'basic';
      shippingCost = 8;
    }
    
    const totalCost = amount + shippingCost;
    
    // 3. Registrar la compra en user_purchases
    await mongoose.connection.db.collection('user_purchases').insertOne({
      userId: new mongoose.Types.ObjectId(userId),
      type: 'article_purchase',
      articleIds: [new mongoose.Types.ObjectId(articleId)],
      amount: amount,
      currency: 'eur',
      paymentMethod: 'stripe_checkout',
      stripeSessionId: 'cs_test_simulated_' + Date.now(),
      status: 'completed',
      shippingCost: shippingCost,
      totalCost: totalCost,
      packageType: packageType,
      createdAt: new Date()
    });
    
    console.log('✅ Compra registrada en user_purchases');

    res.json({
      success: true,
      message: 'Compra simulada exitosamente',
      data: {
        articleId,
        amount,
        shippingCost,
        totalCost,
        packageType
      }
    });

  } catch (error) {
    console.error('❌ Error simulando compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al simular la compra',
      error: error.message
    });
  }
});

/**
 * GET /api/stripe/my-purchases
 * Obtener compras del usuario autenticado
 */
router.get('/my-purchases', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('📦 Obteniendo compras del usuario:', userId);

    const mongoose = require('mongoose');
    
    // Obtener compras del usuario
    const purchases = await mongoose.connection.db.collection('user_purchases')
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Obtener información detallada de los artículos para cada compra
    const purchasesWithDetails = await Promise.all(
      purchases.map(async (purchase) => {
        if (purchase.type === 'article_purchase' && purchase.articleIds) {
          // Obtener detalles de los artículos
          const articles = await mongoose.connection.db.collection('articles')
            .find({ _id: { $in: purchase.articleIds } })
            .toArray();
          
          return {
            ...purchase,
            articles: articles.map(article => ({
              id: article._id,
              title: article.title,
              price: article.price,
              images: article.images || [],
              category: article.category
            }))
          };
        }
        return purchase;
      })
    );

    // Contar total de compras
    const totalPurchases = await mongoose.connection.db.collection('user_purchases')
      .countDocuments({ userId: new mongoose.Types.ObjectId(userId) });

    res.json({
      success: true,
      data: {
        purchases: purchasesWithDetails,
        pagination: {
          page,
          limit,
          total: totalPurchases,
          pages: Math.ceil(totalPurchases / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo compras:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las compras',
      error: error.message
    });
  }
});

/**
 * POST /api/stripe/webhook
 * Webhook para recibir eventos de Stripe
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
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
      
      const { userId, articleIds, type } = session.metadata;
      console.log('👤 Usuario:', userId);
      console.log('📦 Artículos:', articleIds);
      console.log('🔍 Tipo:', type);
      
      try {
        const mongoose = require('mongoose');
        
        // Verificar si es compra de puntos
        if (type === 'points_purchase') {
          console.log('⭐ Procesando compra de puntos...');
          
          const pointsAmount = parseInt(session.metadata.pointsAmount) || 0;
          const bonusPoints = parseInt(session.metadata.bonusPoints) || 0;
          const totalPoints = pointsAmount + bonusPoints;
          
          // Actualizar puntos del usuario
          await mongoose.connection.db.collection('users').updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { 
              $inc: { points: totalPoints },
              $set: { 
                lastPointsPurchase: new Date(),
                lastPointsAmount: totalPoints
              }
            }
          );
          
          // Registrar la compra de puntos en user_purchases
          await mongoose.connection.db.collection('user_purchases').insertOne({
            userId: new mongoose.Types.ObjectId(userId),
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
          // Procesar compra de artículos (lógica existente)
          console.log('📦 Procesando compra de artículos...');
          
          // Si articleIds es un string separado por comas, convertir a array
          const articleIdArray = articleIds.split(',');
          
          // Actualizar cada artículo como vendido
          for (const articleId of articleIdArray) {
            await mongoose.connection.db.collection('articles').updateOne(
              { _id: new mongoose.Types.ObjectId(articleId) },
              { 
                $set: { 
                  status: 'sold',
                  estado: 'vendido',
                  estado_articulo: 'VENDIDO_DINERO',
                  sold: true,
                  buyer: new mongoose.Types.ObjectId(userId),
                  comprador: new mongoose.Types.ObjectId(userId),
                  comprador_tipo: 'usuario',
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
          const articles = await mongoose.connection.db.collection('articles').find({
            _id: { $in: articleIdArray.map(id => new mongoose.Types.ObjectId(id)) }
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
          await mongoose.connection.db.collection('user_purchases').insertOne({
            userId: new mongoose.Types.ObjectId(userId),
            type: 'article_purchase',
            articleIds: articleIdArray.map(id => new mongoose.Types.ObjectId(id)),
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
        
        // TODO: Enviar email de confirmación al comprador y vendedor
        
      } catch (error) {
        console.error('❌ Error actualizando base de datos:', error);
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
          const mongoose = require('mongoose');
          const articleId = paymentIntent.metadata.articleId;
          const userId = paymentIntent.metadata.userId;
          
          await mongoose.connection.db.collection('articles').updateOne(
            { _id: new mongoose.Types.ObjectId(articleId) },
            { 
              $set: { 
                status: 'sold',
                estado: 'vendido',
                estado_articulo: 'VENDIDO_DINERO',
                sold: true,
                buyer: new mongoose.Types.ObjectId(userId),
                comprador: new mongoose.Types.ObjectId(userId),
                comprador_tipo: 'usuario',
                soldAt: new Date(),
                paymentMethod: 'stripe_payment_intent',
                stripePaymentIntentId: paymentIntent.id,
                paidAmount: paymentIntent.amount / 100,
                currency: paymentIntent.currency
              }
            }
          );
          
          console.log(`✅ Artículo ${articleId} marcado como vendido (Payment Intent)`);
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

  res.json({ received: true });
});

/**
 * GET /api/stripe/payment-success
 * Verifica el pago y completa la compra
 */
router.get('/payment-success', authMiddleware, async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID no proporcionado'
      });
    }

    // Recuperar la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      console.log('✅ Pago verificado:', session.id);
      
      // TODO: Actualizar la base de datos
      // - Marcar artículos como vendidos
      // - Registrar la compra
      // - Actualizar puntos del usuario si aplica
      
      res.json({
        success: true,
        message: 'Pago completado exitosamente',
        session: {
          id: session.id,
          amount: session.amount_total / 100,
          currency: session.currency,
          customerEmail: session.customer_email
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'El pago no ha sido completado'
      });
    }

  } catch (error) {
    console.error('❌ Error verificando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el pago',
      error: error.message
    });
  }
});

module.exports = router;

