import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import routes from './routes/index.js';
import errorHandler from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import AppError from './utils/AppError.js';
import { ERROR_CODES } from './constants/errorCodes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS with credentials (allows all origins in dev and deployed environments)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Request logger
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers & Cookie parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiter for general API requests
app.use(env.API_PREFIX, apiLimiter);

// Mount API routes
app.use(env.API_PREFIX, routes);

// Serve frontend static build assets if dist exists (Production Single Service Deployment)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // SPA fallback for all frontend client-side routes
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith(env.API_PREFIX)) {
      return next();
    }
    const indexHtml = path.join(frontendDistPath, 'index.html');
    res.sendFile(indexHtml, (err) => {
      if (err) next();
    });
  });
}

// 404 Route Handler for undefined API endpoints
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Cannot find endpoint ${req.originalUrl} on IEM Admission System server.`,
      404,
      ERROR_CODES.NOT_FOUND
    )
  );
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
