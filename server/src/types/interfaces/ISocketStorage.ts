export type SocketId = string;

export interface ISocketStorage<SocketType> {
  getById(id: SocketId): SocketType;
  addSocket(socket: SocketType): SocketId;
  deleteSocketById(id: SocketId): void;
  deleteSocket(socket: SocketType): void;
}
