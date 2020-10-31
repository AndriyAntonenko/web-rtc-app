class WebSocketService {
  private readonly _ws: WebSocket;

  constructor(url: string) {
    this._ws = new WebSocket(url);
  }

  public get ws(): WebSocket {
    return this._ws;
  }

  addOnMessageHandler<T>(handler: (message: MessageEvent<T>) => void | Promise<void>) {
    this._ws.addEventListener('message', handler);
  }

  addOnOpenHandler(handler: () => void | Promise<void>) {
    this._ws.addEventListener('open', handler);
  }

  addOnCloseHandler(handler: () => void | Promise<void>) {
    this._ws.addEventListener('close', handler);
  }

  addOnErrorHandler(handler: () => void | Promise<void>) {
    this._ws.addEventListener('error', handler);
  }

  sendMessage(message: any) {
    this._ws.send(message);
  }
}

export { WebSocketService }
