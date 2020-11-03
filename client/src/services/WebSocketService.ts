import { SocketEventTypes, ISocketMessage } from '@webrtc_experiment/shared';

type EventHandler<T> = (eventData: T) => void | Promise<void>;
type Handler = () => void | Promise<void>;

class WebSocketService {
  private readonly _ws: WebSocket;
  private readonly _eventHandlersMap: Map<SocketEventTypes, Array<EventHandler<any>>>;

  constructor(url: string) {
    this._ws = new WebSocket(url);
    this._eventHandlersMap = new Map();
  }

  addOnEventHandler<T>(eventType: SocketEventTypes, handler: EventHandler<T>) {
    if (!this._eventHandlersMap.get(eventType)) {
      this._eventHandlersMap.set(eventType, []);
    }
    this._eventHandlersMap.get(eventType)?.push(handler);
  }

  removeOnEventHandler<T>(eventType: SocketEventTypes, handlerToRemove: EventHandler<T>) {
    const handlers = this._eventHandlersMap.get(eventType);
    if (!handlers) {
      return;
    }

    const newHandlers = handlers.filter(handler => handler.toString() !== handlerToRemove.toString());
    this._eventHandlersMap.set(eventType, newHandlers);
  }

  onMessage() {
    this._ws.addEventListener('message', (message: MessageEvent<string>) => {
      const payload: ISocketMessage = JSON.parse(message.data);
      const handlers = this._eventHandlersMap.get(payload.event);
      if (handlers) {
        handlers.forEach(handler => {
          handler(payload.data);
        });
      }
    });
  }

  onOpen(handler: Handler) {
    this._ws.addEventListener('open', async () => {
      await handler();
      this.onMessage();
    });
  }

  sendMessage(message: any) {
    this._ws.send(message);
  }
}

export { WebSocketService }
