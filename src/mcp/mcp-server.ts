import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { MongoClient, Db } from 'mongodb';

interface MCPConfig {
  mongodbUri: string;
  databaseName: string;
}

class MongoMCPServer {
  private server: Server;
  private mongoClient: MongoClient | null = null;
  private db: Db | null = null;
  private config: MCPConfig;

  constructor(config: MCPConfig) {
    this.config = config;
    this.server = new Server(
      {
        name: 'mongodb-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // Listar herramientas disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'mongodb_query',
            description: 'Ejecutar una consulta en MongoDB',
            inputSchema: {
              type: 'object',
              properties: {
                collection: {
                  type: 'string',
                  description: 'Nombre de la colección',
                },
                operation: {
                  type: 'string',
                  enum: ['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'count'],
                  description: 'Operación a realizar',
                },
                query: {
                  type: 'object',
                  description: 'Query de MongoDB',
                },
                options: {
                  type: 'object',
                  description: 'Opciones adicionales para la operación',
                },
              },
              required: ['collection', 'operation'],
            },
          },
          {
            name: 'mongodb_aggregate',
            description: 'Ejecutar una agregación en MongoDB',
            inputSchema: {
              type: 'object',
              properties: {
                collection: {
                  type: 'string',
                  description: 'Nombre de la colección',
                },
                pipeline: {
                  type: 'array',
                  description: 'Pipeline de agregación',
                },
                options: {
                  type: 'object',
                  description: 'Opciones adicionales',
                },
              },
              required: ['collection', 'pipeline'],
            },
          },
          {
            name: 'mongodb_list_collections',
            description: 'Listar todas las colecciones en la base de datos',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'mongodb_get_stats',
            description: 'Obtener estadísticas de la base de datos',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ] as Tool[],
      };
    });

    // Manejar llamadas a herramientas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        await this.ensureConnection();

        switch (name) {
          case 'mongodb_query':
            return await this.handleQuery(args);
          case 'mongodb_aggregate':
            return await this.handleAggregate(args);
          case 'mongodb_list_collections':
            return await this.handleListCollections();
          case 'mongodb_get_stats':
            return await this.handleGetStats();
          default:
            throw new Error(`Herramienta desconocida: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async ensureConnection() {
    if (!this.mongoClient) {
      this.mongoClient = new MongoClient(this.config.mongodbUri);
      await this.mongoClient.connect();
      this.db = this.mongoClient.db(this.config.databaseName);
    }
  }

  private async handleQuery(args: any) {
    const { collection, operation, query = {}, options = {} } = args;
    
    if (!this.db) throw new Error('No hay conexión a la base de datos');

    const coll = this.db.collection(collection);
    let result;

    switch (operation) {
      case 'find':
        result = await coll.find(query, options).toArray();
        break;
      case 'findOne':
        result = await coll.findOne(query, options);
        break;
      case 'insertOne':
        result = await coll.insertOne(query);
        break;
      case 'insertMany':
        result = await coll.insertMany(query);
        break;
      case 'updateOne':
        result = await coll.updateOne(query.filter, query.update, options);
        break;
      case 'updateMany':
        result = await coll.updateMany(query.filter, query.update, options);
        break;
      case 'deleteOne':
        result = await coll.deleteOne(query, options);
        break;
      case 'deleteMany':
        result = await coll.deleteMany(query, options);
        break;
      case 'count':
        result = await coll.countDocuments(query, options);
        break;
      default:
        throw new Error(`Operación no soportada: ${operation}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleAggregate(args: any) {
    const { collection, pipeline, options = {} } = args;
    
    if (!this.db) throw new Error('No hay conexión a la base de datos');

    const coll = this.db.collection(collection);
    const result = await coll.aggregate(pipeline, options).toArray();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleListCollections() {
    if (!this.db) throw new Error('No hay conexión a la base de datos');

    const collections = await this.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(collectionNames, null, 2),
        },
      ],
    };
  }

  private async handleGetStats() {
    if (!this.db) throw new Error('No hay conexión a la base de datos');

    const stats = await this.db.stats();
    const collections = await this.db.listCollections().toArray();

    const result = {
      database: this.config.databaseName,
      collections: collections.length,
      stats: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
      },
      collectionList: collections.map(col => ({
        name: col.name,
        type: col.type,
      })),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('🚀 Servidor MCP MongoDB iniciado');
  }

  async stop() {
    if (this.mongoClient) {
      await this.mongoClient.close();
    }
    console.log('🛑 Servidor MCP MongoDB detenido');
  }
}

export default MongoMCPServer;
