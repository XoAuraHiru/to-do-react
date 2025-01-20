const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./config/logger');

// Routes to use
const authRoutes = require('./routes/auth.routes.js');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Middlewares to use
app.use(cors());
app.use(express.json());

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
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Management API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


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