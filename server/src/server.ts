import { Server, IncomingMessage, ServerResponse, request } from 'http';
import { fastify, FastifyInstance, RouteShorthandOptions } from 'fastify';
import fastifyCors from 'fastify-cors';
import WebSocket from 'ws';

import { ISocketStorage } from './types/interfaces/ISocketStorage';

type FastifyServerApp = FastifyInstance<Server, IncomingMessage, ServerResponse>;

class FastifyHttpServer {
  private _socketStorage: ISocketStorage<WebSocket>;
  private _serverInstance: FastifyServerApp;

  private readonly pingOptions: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            pong: {
              type: 'string'
            }
          }
        }
      }
    }
  };

  private readonly usersOptions: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            ids: {
              type: 'array'
            }
          }
        }
      }
    }
  };

  constructor(socketStorage: ISocketStorage<WebSocket>) {
    this._socketStorage = socketStorage;
    this._serverInstance = fastify({
      logger: true
    });

    this._serverInstance.register(fastifyCors, {
      origin: 'http://localhost:3000'
    });
  }

  public get server(): Server {
    return this._serverInstance.server;
  }
  
  private setRouter() {
    this._serverInstance.get('/ping', this.pingOptions, (request, reply) => {
      reply.code(200).send({ pong: 'it worked!' });
    });

    this._serverInstance.get('/users', this.usersOptions, (request, reply) => {
      reply.code(200).send({ ids: this._socketStorage.getIds() });
    });
  }

  public initialize(port: string | number) {
    this.setRouter();
    this._serverInstance.listen(port, (err) => {
      if (err) {
        console.error('Error:', err);
        process.exit(1);
      }
      console.info(`Server running on http://localhost:${port}`);
    });
  }
}

export { FastifyHttpServer };
