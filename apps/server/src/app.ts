import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { mountRoutes } from './api/routes/index';
import config from './config/index';

const app = express();

if (config.isProduction) {
  app.use(compression());
}

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: config.isProduction
      ? config.corsOrigin.prod
      : config.corsOrigin.dev,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mountRoutes(app);

export default app;
