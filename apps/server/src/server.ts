import { WebSocketServer } from 'ws';
import app from '@/app';
import config from '@/config';
import { initWSEvents } from '@/features/Collaboration/controller';
import * as queries from '@/features/Page/mutators/index';
import Jobs from '@/jobs/index';
import { validateWSConnection } from '@/middlewares/ws-validator';

queries.createPagesTable();

Jobs.deleteExpiredPages.start();

const httpServer = app.listen(config.port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on http://localhost:${config.port}`);
});

const wsServer = new WebSocketServer({ noServer: true, path: '/page' });

httpServer.on('upgrade', (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (ws) => {
    const validated = validateWSConnection(req);

    if (validated) {
      wsServer.emit('connection', ws, req);
    } else {
      ws.close(1011, 'Bad request');
    }
  });
});

wsServer.on('connection', initWSEvents);
