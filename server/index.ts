import { FastifyHttpServer } from './src/server';
import { WsServer } from './src/wsServer';
import { SocketStorage } from './src/socketStorage';

(async () => {
  const socketStorage = new SocketStorage();
  const server = new FastifyHttpServer(socketStorage);
  const wss = new WsServer(server.server, socketStorage);

  wss.connection();

  server.initialize(process.env.PORT || 5000);
})();
