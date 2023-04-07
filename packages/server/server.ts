import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { mountRoutes } from './routes/index.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mountRoutes(app);

const port = process.env.PORT || 7456;

app.listen(Number(port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on http://localhost:${port}`);
});
