const https = require('https');

async function getAtlasInfo() {
  const apiKey = 'ipztqgwp';
  const apiSecret = 'b72dc085-75a3-4064-947a-bed99b4a07ac';
  
  // Crear token de acceso
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  
  const options = {
    hostname: 'cloud.mongodb.com',
    port: 443,
    path: '/api/atlas/v1.0/orgs',
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

getAtlasInfo()
  .then(result => {
    console.log('📋 Organizaciones encontradas:');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });
