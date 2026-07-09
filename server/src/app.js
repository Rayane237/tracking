import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// CORS configuration - Accept both development and production origins
const getCorsOptions = () => {
  const origin = (origin, callback) => {
    // Allow no origin (mobile apps, curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Development origins
    const devOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.136.1:5174"
    ];

    const productionOrigins = [
      "https://dubaiglobal-suivi.vercel.app"
    ];

    if (devOrigins.includes(origin) || productionOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Production origins - Accept any vercel.app, railway.app, netlify.app
    if (process.env.NODE_ENV === 'production') {
      if (origin.includes('vercel.app') || origin.includes('railway.app') || origin.includes('netlify.app')) {
        return callback(null, true);
      }
    }

    // Accept CLIENT_URL if explicitly set
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }

    // Reject other origins
    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  };

  return {
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
};

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors(getCorsOptions())
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 220,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Dubai Global Express API'
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/track', publicRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
