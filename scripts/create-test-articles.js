import fetch from 'node-fetch';

const testArticles = [
  {
    title: "iPhone 13 Pro",
    description: "iPhone 13 Pro en excelente estado, poco uso",
    price: 800,
    category: "Electrónicos",
    condition: "Usado",
    location: "Madrid, España",
    images: ["https://via.placeholder.com/300x200"],
    sellerId: "507f1f77bcf86cd799439011"
  },
  {
    title: "Sofá de Cuero",
    description: "Sofá de cuero genuino, muy cómodo",
    price: 450,
    category: "Hogar",
    condition: "Usado",
    location: "Barcelona, España",
    images: ["https://via.placeholder.com/300x200"],
    sellerId: "507f1f77bcf86cd799439011"
  },
  {
    title: "Smart TV Samsung 55\"",
    description: "Smart TV Samsung 55 pulgadas, 4K",
    price: 600,
    category: "Electrónicos",
    condition: "Usado",
    location: "Valencia, España",
    images: ["https://via.placeholder.com/300x200"],
    sellerId: "507f1f77bcf86cd799439011"
  },
  {
    title: "Libro de García Márquez",
    description: "Cien años de soledad, edición especial",
    price: 25,
    category: "Libros",
    condition: "Nuevo",
    location: "Sevilla, España",
    images: ["https://via.placeholder.com/300x200"],
    sellerId: "507f1f77bcf86cd799439011"
  }
];

async function createArticles() {
  console.log('🚀 Creando artículos de prueba...');
  
  for (const article of testArticles) {
    try {
      const response = await fetch('http://localhost:3002/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Artículo creado: ${article.title}`);
      } else {
        console.log(`❌ Error creando ${article.title}:`, result);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, await response.text());
      }
    } catch (error) {
      console.log(`❌ Error de conexión para ${article.title}:`, error.message);
    }
  }
  
  console.log('✨ Proceso completado');
}

createArticles();
