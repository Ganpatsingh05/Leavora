require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB, isMemoryDB } = require('./config/db');
const { seedDB } = require('./seed/seed');

const startServer = async () => {
  // Connect to MongoDB (falls back to in-memory if local/remote unavailable)
  await connectDB();

  // Auto-seed when using in-memory DB so there's always data to work with
  if (isMemoryDB()) {
    console.log('Auto-seeding in-memory database...');
    await seedDB();
  }

  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile, curl, etc.) in dev
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );

  // Rate limiting
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', generalLimiter);
  app.use('/api/auth', authLimiter);

  // Compression & logging
  app.use(compression());
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  app.use(express.json({ limit: '10kb' }));

  // Trust proxy (for rate limiter behind reverse proxy)
  app.set('trust proxy', 1);

  // Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/leaves', require('./routes/leaves'));
  app.use('/api/users', require('./routes/users'));

  // Health check
  const mongoose = require('mongoose');
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'HR Leave Management API is running',
      dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
