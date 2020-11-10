import WebSocket from 'ws';
import { v4 as uuidV4 } from 'uuid';
import { ISocketStorage, SocketId } from './types/interfaces/ISocketStorage';

class SocketStorage implements ISocketStorage<WebSocket> {
  private readonly _activeSockets: Map<SocketId, WebSocket>;

  constructor() {
    this._activeSockets = new Map();
  }

  getIds(except?: SocketId[]): SocketId[] {
    const ids: SocketId[] = [];
    this._activeSockets.forEach((_, key) => {
      if (except && !except.includes(key)) {
        ids.push(key)
      }
    });
    return ids;
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

  deleteSocket(socket: WebSocket): SocketId {
    let id: SocketId;
    
    for (let [activeSocketId, activeSocket] of this._activeSockets) {
      if (activeSocket === socket) {
        id = activeSocketId;
        break;
      }
    }

    this._activeSockets.delete(id);
    return id;
  }
}

export { SocketStorage };
