import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
require('dotenv').config();
import logger from './config/logger';

// Routes to use
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middlewares to use
app.use(cors());
app.use(json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// MongoDB connection
connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes to use
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Management API' });
});
app.use('/api/auth', authRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});