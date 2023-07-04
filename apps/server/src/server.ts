import app from '@/app';
import config from '@/config';
import * as queries from '@/features/Page/mutators/index';
import Jobs from '@/jobs/index';
import { validateWSConnection } from '@/middlewares/ws-validator';
import { WebSocketService } from '@/services/websocket';
import { initCollabConnection } from './features/Collaboration/controller';

queries.createPagesTable();

Jobs.deleteExpiredPages.start();

const httpServer = app.listen(config.port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on http://localhost:${config.port}`);
});

const webSocket = new WebSocketService(initCollabConnection, {
  noServer: true,
  path: '/page',
});

httpServer.on('upgrade', (req, socket, head) => {
  webSocket.server.handleUpgrade(req, socket, head, (ws) => {
    const validated = validateWSConnection(req);

    if (validated) {
      webSocket.server.emit('connection', ws, req);
    } else {
      ws.close(1011, 'Bad request');
    }
  });
});
