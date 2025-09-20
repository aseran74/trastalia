const https = require('https');

async function getClusterInfo() {
  const apiKey = 'ipztqgwp';
  const apiSecret = 'b72dc085-75a3-4064-947a-bed99b4a07ac';
  const projectId = '68c7dde45281f22dfdaebc62';
  
  // Crear token de acceso
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  
  const options = {
    hostname: 'cloud.mongodb.com',
    port: 443,
    path: `/api/atlas/v1.0/groups/${projectId}/clusters`,
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

getClusterInfo()
  .then(result => {
    console.log('📋 Clusters encontrados:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.results && result.results.length > 0) {
      console.log('\n🔗 Connection strings sugeridos:');
      result.results.forEach(cluster => {
        console.log(`\nCluster: ${cluster.name}`);
        console.log(`Connection String: mongodb+srv://alvaroserr:alvaro123@${cluster.name}.mongodb.net/trastalia?retryWrites=true&w=majority`);
      });
    }
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verificar que las credenciales sean correctas');
    console.log('2. Verificar que el Project ID sea correcto');
    console.log('3. Verificar que la API Key tenga permisos de lectura');
  });
