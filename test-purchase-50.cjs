const http = require('http');

const postData = JSON.stringify({
  articleId: '68d3c07df8cbb79d52499d89',
  pointsAmount: 50
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/articles/purchase-with-points',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mongodb-user-token-68cd4472601315508398cd51',
    'Content-Length': Buffer.byteLength(postData)
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

req.write(postData);
req.end();
