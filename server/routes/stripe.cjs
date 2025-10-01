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
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
      metadata: {
        userId: userId.toString(),
        articleIds: items.map(item => item.id).join(',')
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
      
      // Aquí deberías:
      // 1. Actualizar el estado de los artículos en la base de datos
      // 2. Registrar la compra
      // 3. Enviar email de confirmación
      
      const { userId, articleIds } = session.metadata;
      console.log('👤 Usuario:', userId);
      console.log('📦 Artículos:', articleIds);
      
      // TODO: Implementar la lógica de actualización de la base de datos
      
      break;
    }
    
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('💰 PaymentIntent completado:', paymentIntent.id);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.error('❌ Pago fallido:', paymentIntent.id);
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

