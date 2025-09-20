#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Configuración de Credenciales MongoDB Atlas');
console.log('===============================================\n');

console.log('📋 Necesitarás las siguientes credenciales de Atlas:');
console.log('   1. API Key (Client ID)');
console.log('   2. API Secret (Client Secret)');
console.log('   3. Connection String\n');

console.log('💡 Si no las tienes, sigue estos pasos:');
console.log('   1. Ve a cloud.mongodb.com');
console.log('   2. Access Manager → API Keys → Create API Key');
console.log('   3. En tu cluster → Connect → Connect your application\n');

const questions = [
  {
    key: 'MDB_MCP_API_CLIENT_ID',
    prompt: '🔑 Ingresa tu API Key (Client ID): ',
    required: true
  },
  {
    key: 'MDB_MCP_API_CLIENT_SECRET',
    prompt: '🔐 Ingresa tu API Secret (Client Secret): ',
    required: true
  },
  {
    key: 'MDB_MCP_CONNECTION_STRING',
    prompt: '🔗 Ingresa tu Connection String: ',
    required: true
  }
];

const credentials = {};

function askQuestion(index) {
  if (index >= questions.length) {
    saveCredentials();
    return;
  }

  const question = questions[index];
  
  rl.question(question.prompt, (answer) => {
    if (question.required && !answer.trim()) {
      console.log('❌ Este campo es requerido. Inténtalo de nuevo.\n');
      askQuestion(index);
      return;
    }

    credentials[question.key] = answer.trim();
    askQuestion(index + 1);
  });
}

function saveCredentials() {
  const envPath = path.join(__dirname, '..', '.env');
  
  // Leer archivo .env existente
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Actualizar o agregar credenciales
  let updatedContent = envContent;
  
  Object.entries(credentials).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;
    
    if (regex.test(updatedContent)) {
      updatedContent = updatedContent.replace(regex, newLine);
    } else {
      updatedContent += `\n${newLine}`;
    }
  });

  // Escribir archivo actualizado
  fs.writeFileSync(envPath, updatedContent);
  
  console.log('\n✅ Credenciales guardadas en .env');
  console.log('📁 Archivo: ' + envPath);
  console.log('\n🚀 Ahora puedes ejecutar:');
  console.log('   npm run dev:with-atlas');
  
  rl.close();
}

// Iniciar el proceso
askQuestion(0);
