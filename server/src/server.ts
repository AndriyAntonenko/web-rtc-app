import { fastify, FastifyInstance, RouteShorthandOptions } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

type FastifyServerApp = FastifyInstance<Server, IncomingMessage, ServerResponse>;

class FastifyHttpServer {
  private readonly _serverInstance: FastifyServerApp;
  private readonly opts: RouteShorthandOptions = {
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

  constructor() {
    this._serverInstance = fastify({
      logger: true
    });
  }

  private setRouter() {
    this._serverInstance.get('/ping', this.opts, (request, reply) => {
      reply.code(200).send({ pong: 'it worked!' });
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
