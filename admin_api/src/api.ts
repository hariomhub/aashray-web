import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './db/connection';
import logger from './utils/logger';

// Routes
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import onboardingRoutes from './routes/onboarding';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
  ],
  credentials: true,
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/onboarding', onboardingRoutes);

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Boot ──────────────────────────────────────────────────────────────────────
async function bootstrap() {
  // DB connection is optional at startup — routes will fail gracefully if DB is down
  try {
    await testConnection();
  } catch {
    logger.warn('⚠️  MySQL not available — server will start anyway. DB-dependent routes will return 503.');
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Aashray Admin API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
