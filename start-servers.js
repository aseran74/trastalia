#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando servidores de Trastalia...\n');

// Función para crear un proceso
function startProcess(name, command, args, cwd = process.cwd()) {
  console.log(`📱 Iniciando ${name}...`);
  
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit',
    shell: true
  });

  process.on('error', (err) => {
    console.error(`❌ Error iniciando ${name}:`, err.message);
  });

  process.on('exit', (code) => {
    if (code !== 0) {
      console.log(`⚠️  ${name} terminó con código ${code}`);
    }
  });

  return process;
}

// Función para esperar
function wait(seconds) {
  return new Promise(resolve => {
    console.log(`⏳ Esperando ${seconds} segundos...`);
    setTimeout(resolve, seconds * 1000);
  });
}

// Función principal
async function main() {
  try {
    // Iniciar backend
    const backend = startProcess('Backend (Puerto 3002)', 'node', ['server/working-server.cjs']);
    
    // Esperar a que el backend se inicie
    await wait(3);
    
    // Iniciar frontend
    const frontend = startProcess('Frontend (Puerto 5173)', 'npm', ['run', 'dev']);
    
    console.log('\n✅ Servidores iniciados:');
    console.log('   Backend:  http://localhost:3002');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Admin:    http://localhost:5173/admin/articles');
    console.log('\n🔑 Credenciales:');
    console.log('   Admin: admin@trastalia.com / admin123456');
    console.log('   User:  carlos@example.com / carlos123');
    console.log('\n💡 Presiona Ctrl+C para detener ambos servidores\n');
    
    // Manejar cierre
    process.on('SIGINT', () => {
      console.log('\n🛑 Deteniendo servidores...');
      backend.kill('SIGTERM');
      frontend.kill('SIGTERM');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
