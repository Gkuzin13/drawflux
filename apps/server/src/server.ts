import Jobs from './api/jobs/index';
import queries from './api/queries/index';
import { openNewWSConnection } from './api/services/collaboration/handlers';
import app from './app';
import config from './config';

(async () => {
  await queries.createPagesTable();
})();

Jobs.deleteExpiredPages.start();

const httpServer = app.listen(config.port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on http://localhost:${config.port}`);
});

httpServer.on('upgrade', openNewWSConnection);
