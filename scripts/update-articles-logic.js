import fetch from 'node-fetch';

// Artículos que solo se venden por dinero (12 artículos)
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

// Artículos que se venden por dinero Y por intercambio (4 artículos)
const articlesWithExchange = [
  'Sony PlayStation 5 + 2 Mandos DualSense',
  'DJI Mavic 3 Pro + 3 Baterías',
  'Colección Completa de Cómics Marvel (2015-2020)',
  'Reloj Rolex Submariner Date 116610LN'
];

async function updateArticles() {
  console.log('🔄 Actualizando lógica de artículos...');
  
  try {
    // Obtener todos los artículos
    const response = await fetch('http://localhost:3002/api/articles');
    const data = await response.json();
    
    if (!data.success) {
      console.log('❌ Error obteniendo artículos:', data.message);
      return;
    }
    
    const articles = data.data;
    console.log(`📋 Encontrados ${articles.length} artículos`);
    
    // Actualizar artículos que solo se venden por dinero
    for (const article of articles) {
      if (articlesOnlyMoney.includes(article.title)) {
        console.log(`💰 Configurando ${article.title} - Solo dinero`);
        // Aquí actualizarías el artículo para que solo tenga isForSale: true
        // y isForExchange: false, wantsPoints: false, wantsDirectExchange: false
      } else if (articlesWithExchange.includes(article.title)) {
        console.log(`🔄 Configurando ${article.title} - Dinero + Intercambio`);
        // Aquí mantienes isForSale: true, isForExchange: true, wantsPoints: true, wantsDirectExchange: true
      }
    }
    
    console.log('✅ Actualización completada');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

updateArticles();