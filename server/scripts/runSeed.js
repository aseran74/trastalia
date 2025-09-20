const { exec } = require('child_process');
const path = require('path');

console.log('🌱 Iniciando siembra de datos...');

// Ejecutar el script de siembra
exec(`node ${path.join(__dirname, 'seedArticles.js')}`, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error ejecutando el script:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Advertencias:', stderr);
  }
  
  console.log(stdout);
});

