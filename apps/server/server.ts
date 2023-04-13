import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import * as db from './db/index.js';
import jobs from './db/jobs.js';
import { queriesPaths } from './db/queries/index.js';
import { mountRoutes } from './routes/index.js';
import { getQuery } from './utils/getQuery/getQuery.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}
console;
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mountRoutes(app);

await (async () => {
  const client = await db.getClient();

  try {
    const query = await getQuery(queriesPaths.createPageTable);

    await db.query(query);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
})();

jobs.deleteExpiredPages.start();

const port = process.env.PORT || 7456;

app.listen(Number(port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on http://localhost:${port}`);
});
