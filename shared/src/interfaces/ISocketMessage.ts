import { SocketEventTypes } from '../enums/SocketEventTypes';

export interface ISocketMessage<T = object> {
  event: SocketEventTypes;
  data?: T;
}
