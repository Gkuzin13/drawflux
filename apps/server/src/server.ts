import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import * as db from './db/index.js';
import jobs from './db/jobs.js';
import { queries } from './db/queries/index.js';
import { mountRoutes } from './routes/index.js';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

if (isProduction) {
  app.use(compression());
} else {
  dotenv.config();
}

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: isProduction ? process.env.ORIGIN_URL : 'http://localhost:5174',
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mountRoutes(app);

await (async () => {
  const client = await db.getClient();

  try {
    await db.query(queries.createPageTable);
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
