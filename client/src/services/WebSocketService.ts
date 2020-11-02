class WebSocketService {
  private readonly _ws: WebSocket;

  constructor(url: string) {
    this._ws = new WebSocket(url);
  }

  public get ws(): WebSocket {
    return this._ws;
  }

  sendMessage(message: any) {
    this._ws.send(message);
  }
}

export { WebSocketService }
