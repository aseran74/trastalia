import fetch from 'node-fetch';

async function testUpdate() {
  try {
    console.log('🔍 Probando endpoint de actualización...');
    
    const response = await fetch('http://localhost:3002/api/articles/update-logic');
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', result);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testUpdate();
