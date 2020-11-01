import { FastifyHttpServer } from './src/server';
import { WsServer } from './src/wsServer';
import { SocketStorage } from './src/socketStorage';

(async () => {
  const server = new FastifyHttpServer();
  const wss = new WsServer(server.server, new SocketStorage());

  wss.connection();

  server.initialize(process.env.PORT || 5000);
})();
