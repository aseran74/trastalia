const http = require('http');

const data = JSON.stringify({
  email: "juan@example.com",
  password: "juan123456"
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
    
    if (res.statusCode === 200) {
      const response = JSON.parse(body);
      if (response.success && response.token) {
        console.log('Token de Juan:', response.token);
        
        // Probar el endpoint de artículos vendidos
        const soldOptions = {
          hostname: 'localhost',
          port: 3002,
          path: '/api/articles/sold-articles',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${response.token}`,
            'Content-Type': 'application/json'
          }
        };
        
        const soldReq = http.request(soldOptions, (soldRes) => {
          let soldBody = '';
          soldRes.on('data', (chunk) => {
            soldBody += chunk;
          });
          soldRes.on('end', () => {
            console.log('\n--- Artículos vendidos ---');
            console.log('Status:', soldRes.statusCode);
            console.log('Body:', soldBody);
          });
        });
        
        soldReq.on('error', (e) => {
          console.error('Error en sold-articles:', e.message);
        });
        
        soldReq.end();
      }
    }
  });
});

req.on('error', (e) => {
  console.error('Error en login:', e.message);
});

req.write(data);
req.end();

