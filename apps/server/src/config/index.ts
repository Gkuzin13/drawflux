export default {
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 3000),
  corsOrigin: {
    prod: 'https://drawflux.onrender.com',
    dev: 'http://localhost:5174',
  },
} as const;
