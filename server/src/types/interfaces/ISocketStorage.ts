export type SocketId = string;

export interface ISocketStorage<SocketType> {
  getIds(except?: SocketId[]): SocketId[];
  getById(id: SocketId): SocketType;
  addSocket(socket: SocketType): SocketId;
  deleteSocketById(id: SocketId): void;
  deleteSocket(socket: SocketType): SocketId;
}
