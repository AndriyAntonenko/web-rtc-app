export interface ISocketMessage<T = object> {
  event: string;
  data: T;
}
