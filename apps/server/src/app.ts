import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
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

export default app;
