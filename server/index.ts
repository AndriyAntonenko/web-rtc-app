import { FastifyHttpServer } from './src/server';
import { WsServer } from './src/wsServer';

(async () => {
  const server = new FastifyHttpServer();
  const wss = new WsServer(server.server);

  wss.connection();

  server.initialize(process.env.PORT || 5000);
})();
