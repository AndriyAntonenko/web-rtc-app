import { Server as HttpServer } from 'http';
import WebSocket, { Server, Data } from 'ws';

class WsServer {
  private readonly _wss: Server;

  constructor(httpServer: HttpServer) {
    this._wss = new Server({ server: httpServer });
  }

  private handleOnMessage(ws: WebSocket) {
    ws.on('message', (message: Data) => {
      console.info(message);
    });
  }

  connection() {
    this._wss.on('connection', ws => {
      this.handleOnMessage(ws);
    });
  }
}

export { WsServer };
