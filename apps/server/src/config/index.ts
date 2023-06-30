import * as dotenv from 'dotenv';

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  dotenv.config();
}

export default {
  pgConnectionUri: process.env.PG_CONNECTION_URI,
  isProduction,
  port: Number(process.env.PORT || 7456),
  corsOrigin: {
    prod: process.env.ORIGIN_URL,
    dev: 'http://localhost:5174',
  },
} as const;
