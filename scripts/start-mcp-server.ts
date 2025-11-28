#!/usr/bin/env tsx

import MongoMCPServer from '../src/mcp/mcp-server.js';

// URI de MongoDB Atlas - usar la misma que el servidor principal
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mikabodea:Mika1974%26@trastalia.ycg2lvb.mongodb.net/trastalia?retryWrites=true&w=majority&appName=Trastalia';

// Extraer el nombre de la base de datos de la URI
const getDatabaseName = (uri: string): string => {
  try {
    const url = new URL(uri);
    const pathname = url.pathname;
    // Si hay un pathname, usar la primera parte después de /
    if (pathname && pathname.length > 1) {
      return pathname.split('/')[1] || 'trastalia';
    }
    // Si no, intentar extraer de los parámetros de consulta
    return 'trastalia';
  } catch {
    return 'trastalia';
  }
};

const config = {
  mongodbUri: MONGODB_URI,
  databaseName: getDatabaseName(MONGODB_URI),
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
