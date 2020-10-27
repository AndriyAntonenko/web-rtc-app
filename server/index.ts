import { FastifyHttpServer } from './src/server';

(async () => {
  const server = new FastifyHttpServer();
  server.initialize(process.env.PORT || 5000);
})();
