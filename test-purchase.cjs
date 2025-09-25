const fetch = require('node-fetch');

async function testPurchase() {
  try {
    const response = await fetch('http://localhost:3002/api/articles/purchase-with-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mongodb-user-token-68cd4472601315508398cd51'
      },
      body: JSON.stringify({
        articleId: '68d3c07df8cbb79d52499d89',
        pointsAmount: 120
      })
    });

    const data = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testPurchase();
