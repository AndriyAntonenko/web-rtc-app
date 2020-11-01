import WebSocket from 'ws';
import { v4 as uuidV4 } from 'uuid';
import { ISocketStorage, SocketId } from './types/interfaces/ISocketStorage';

class SocketStorage implements ISocketStorage<WebSocket> {
  private readonly _activeSockets: Map<SocketId, WebSocket>;

  constructor() {
    this._activeSockets = new Map();
  }

  getById(id: SocketId): WebSocket {
    return this._activeSockets.get(id);
  }

  addSocket(socket: WebSocket): SocketId {
    const id = uuidV4();
    this._activeSockets.set(id, socket);
    return id;
  }

  deleteSocketById(id: SocketId): void {
    this._activeSockets.delete(id);
  }

  deleteSocket(socket: WebSocket): void {
    let id: SocketId;
    
    for (let [activeSocketId, activeSocket] of this._activeSockets) {
      if (activeSocket === socket) {
        id = activeSocketId;
        break;
      }
    }

    this._activeSockets.delete(id);
  }
}

export { SocketStorage };
