#!/usr/bin/env tsx

import MongoMCPServer from '../src/mcp/mcp-server.js';

const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tailadmin',
  databaseName: 'tailadmin',
};

const server = new MongoMCPServer(config);

// Manejar señales de terminación
process.on('SIGINT', async () => {
  console.log('\n🛑 Deteniendo servidor MCP...');
  await server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Deteniendo servidor MCP...');
  await server.stop();
  process.exit(0);
});

// Iniciar el servidor
server.start().catch((error) => {
  console.error('❌ Error al iniciar servidor MCP:', error);
  process.exit(1);
});
