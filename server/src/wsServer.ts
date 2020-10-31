import { Server as HttpServer } from 'http';
import WebSocket, { Server, Data } from 'ws';

class WsServer {
  private readonly wss: Server;

  constructor(httpServer: HttpServer) {
    this.wss = new Server({ server: httpServer });
  }

  private handleOnMessage(ws: WebSocket) {
    ws.on('message', (message: Data) => {
      console.info(message);
    });
  }

  connection() {
    this.wss.on('connection', ws => {
      this.handleOnMessage(ws);
    });
  }
}

export { WsServer };
