import type { IncomingMessage } from 'http';
import { type WebSocket, WebSocketServer } from 'ws';

export interface PatchedWebSocket extends WebSocket {
  isAlive: boolean;
  pingTimeout: NodeJS.Timeout;
}

export const WS_IS_ALIVE_TIMEOUT = 30000;

export class WebSocketService {
  server!: WebSocketServer;
  private interval!: NodeJS.Timer;

  constructor(
    onConnection: (ws: PatchedWebSocket, req: IncomingMessage) => void,
    options: WebSocketServer['options'] = {},
  ) {
    this.server = new WebSocketServer(options);
    this.startHeartbeat();

    this.server.on('connection', (ws: PatchedWebSocket, req) => {
      ws.isAlive = true;

      ws.on('pong', () => this.heartbeat(ws));
      ws.on('error', console.error);

      onConnection(ws, req);
    });

    this.server.on('close', this.onClose);
    this.server.on('error', console.error);
  }

  private onClose() {
    clearInterval(this.interval);
  }

  private heartbeat(ws: PatchedWebSocket) {
    ws.isAlive = true;
  }

  private startHeartbeat() {
    this.interval = setInterval(() => {
      this.server.clients.forEach((client) => {
        const ws = client as PatchedWebSocket;

        if (ws.isAlive === false) {
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, WS_IS_ALIVE_TIMEOUT);
  }
}
