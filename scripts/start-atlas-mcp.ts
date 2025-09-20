#!/usr/bin/env tsx

import { spawn } from 'child_process';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const mcpServer = spawn('C:\\Users\\alvar\\AppData\\Roaming\\npm\\npx.cmd', [
  '-y',
  '@mongodb-js/mongodb-mcp-server'
], {
  env: {
    ...process.env,
    MDB_MCP_API_CLIENT_ID: process.env.MDB_MCP_API_CLIENT_ID,
    MDB_MCP_API_CLIENT_SECRET: process.env.MDB_MCP_API_CLIENT_SECRET,
    MDB_MCP_CONNECTION_STRING: process.env.MDB_MCP_CONNECTION_STRING,
  },
  stdio: 'inherit'
});

mcpServer.on('error', (error) => {
  console.error('❌ Error al iniciar servidor MCP MongoDB Atlas:', error);
  process.exit(1);
});

mcpServer.on('close', (code) => {
  console.log(`🛑 Servidor MCP MongoDB Atlas terminado con código ${code}`);
});

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servidor MCP MongoDB Atlas...');
  mcpServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo servidor MCP MongoDB Atlas...');
  mcpServer.kill('SIGTERM');
  process.exit(0);
});

console.log('🚀 Iniciando servidor MCP MongoDB Atlas...');
console.log('📋 Variables de entorno:');
console.log(`   - MDB_MCP_API_CLIENT_ID: ${process.env.MDB_MCP_API_CLIENT_ID ? '✅ Configurado' : '❌ No configurado'}`);
console.log(`   - MDB_MCP_API_CLIENT_SECRET: ${process.env.MDB_MCP_API_CLIENT_SECRET ? '✅ Configurado' : '❌ No configurado'}`);
console.log(`   - MDB_MCP_CONNECTION_STRING: ${process.env.MDB_MCP_CONNECTION_STRING ? '✅ Configurado' : '❌ No configurado'}`);
