import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface MCPQuery {
  collection: string;
  operation: 'find' | 'findOne' | 'insertOne' | 'insertMany' | 'updateOne' | 'updateMany' | 'deleteOne' | 'deleteMany' | 'count';
  query?: any;
  options?: any;
}

export interface MCPAggregate {
  collection: string;
  pipeline: any[];
  options?: any;
}

class MCPClient {
  private client: Client | null = null;
  private isConnected = false;

  async connect(serverCommand: string, serverArgs: string[] = []) {
    try {
      const transport = new StdioClientTransport({
        command: serverCommand,
        args: serverArgs,
      });

      this.client = new Client(
        {
          name: 'vue-mongodb-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await this.client.connect(transport);
      this.isConnected = true;
      console.log('✅ Cliente MCP conectado');
    } catch (error) {
      console.error('❌ Error al conectar cliente MCP:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Cliente MCP desconectado');
    }
  }

  async query(query: MCPQuery) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'mongodb_query',
            arguments: query,
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Error en consulta MCP:', error);
      throw error;
    }
  }

  async aggregate(aggregate: MCPAggregate) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'mongodb_aggregate',
            arguments: aggregate,
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Error en agregación MCP:', error);
      throw error;
    }
  }

  async listCollections() {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'mongodb_list_collections',
            arguments: {},
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error('Error al listar colecciones:', error);
      throw error;
    }
  }

  async getStats() {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'mongodb_get_stats',
            arguments: {},
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new MCPClient();
