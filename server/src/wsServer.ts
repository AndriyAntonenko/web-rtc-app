import { Server as HttpServer } from 'http';
import WebSocket, { Server, Data } from 'ws';
import { ISocketMessage, SocketEventTypes } from '@webrtc_experiment/shared';

import { ISocketStorage } from './types/interfaces/ISocketStorage';

class WsServer {
  private readonly _wss: Server;
  private readonly _socketStorage: ISocketStorage<WebSocket>;

  constructor(httpServer: HttpServer, socketStorage: ISocketStorage<WebSocket>) {
    this._wss = new Server({ server: httpServer });
    this._socketStorage = socketStorage;
  }

  private handleOnMessage(ws: WebSocket) {
    ws.on('message', (message: Data) => {
      console.info(message);
    });
  }

  private handleOnDisconnect(ws: WebSocket) {
    ws.on('close', () => {
      console.info('disconnected...');
      const id = this._socketStorage.deleteSocket(ws);
      this.broadcast(ws, { event: SocketEventTypes.USER_LEAVE_ROOM, data: { id } });
    });
  }

  private sendEvent(ws: WebSocket, message: ISocketMessage) {
    ws.send(JSON.stringify(message));
  }

  private broadcast(ws: WebSocket, message: ISocketMessage) {
    this._wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        this.sendEvent(client, message)
      }
    });
  }

  private sendToSocketById(id: string, message: ISocketMessage) {
    const ws = this._socketStorage.getById(id);
    if (ws) {
      this.sendEvent(ws, message);
    }
  }

  connection() {
    this._wss.on('connection', ws => {
      const id = this._socketStorage.addSocket(ws);
      this.handleOnMessage(ws);
      this.handleOnDisconnect(ws);

      this.sendEvent(ws, {
        event: SocketEventTypes.UPDATE_MY_CONNECTION_DATA,
        data: { id } 
      });

      this.broadcast(ws, {
        event: SocketEventTypes.USER_JOIN_TO_ROOM,
        data: { id }
      });
    });
  }
}

export { WsServer };
