import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface AtlasMCPQuery {
  collection: string;
  database?: string;
  filter?: any;
  projection?: any;
  sort?: any;
  limit?: number;
  skip?: number;
}

export interface AtlasMCPAggregate {
  collection: string;
  database?: string;
  pipeline: any[];
}

class AtlasMCPClient {
  private client: Client | null = null;
  private isConnected = false;

  async connect() {
    try {
      const transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@mongodb-js/mongodb-mcp-server'],
        env: {
          MDB_MCP_API_CLIENT_ID: import.meta.env.VITE_MDB_MCP_API_CLIENT_ID,
          MDB_MCP_API_CLIENT_SECRET: import.meta.env.VITE_MDB_MCP_API_CLIENT_SECRET,
          MDB_MCP_CONNECTION_STRING: import.meta.env.VITE_MDB_MCP_CONNECTION_STRING,
        }
      });

      this.client = new Client(
        {
          name: 'vue-atlas-mcp-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await this.client.connect(transport);
      this.isConnected = true;
      console.log('✅ Cliente MCP MongoDB Atlas conectado');
    } catch (error) {
      console.error('❌ Error al conectar cliente MCP Atlas:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 Cliente MCP MongoDB Atlas desconectado');
    }
  }

  async listDatabases() {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'list_databases',
            arguments: {},
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error('Error al listar bases de datos:', error);
      throw error;
    }
  }

  async listCollections(database?: string) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'list_collections',
            arguments: { database },
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

  async find(query: AtlasMCPQuery) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'find',
            arguments: query,
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error('Error en consulta find:', error);
      throw error;
    }
  }

  async findOne(query: AtlasMCPQuery) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'find_one',
            arguments: query,
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Error en consulta findOne:', error);
      throw error;
    }
  }

  async aggregate(aggregate: AtlasMCPAggregate) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'aggregate',
            arguments: aggregate,
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error('Error en agregación:', error);
      throw error;
    }
  }

  async insertOne(collection: string, document: any, database?: string) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'insert_one',
            arguments: { collection, database, document },
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Error en insertOne:', error);
      throw error;
    }
  }

  async updateOne(collection: string, filter: any, update: any, database?: string) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'update_one',
            arguments: { collection, database, filter, update },
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Error en updateOne:', error);
      throw error;
    }
  }

  async deleteOne(collection: string, filter: any, database?: string) {
    if (!this.client || !this.isConnected) {
      throw new Error('Cliente MCP Atlas no conectado');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'delete_one',
            arguments: { collection, database, filter },
          },
        },
        { method: 'tools/call' }
      );

      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Error en deleteOne:', error);
      throw error;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new AtlasMCPClient();
