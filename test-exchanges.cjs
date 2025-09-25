const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/articles/my-exchanges',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer mongodb-user-token-68cd4472601315508398cd51'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
