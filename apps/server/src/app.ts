import compression from 'compression';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { mountRoutes } from './routes/index';

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mountRoutes(app);

export default app;
