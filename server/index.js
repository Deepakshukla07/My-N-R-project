import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import signupRouter from './router/signup.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Register API Routers
app.use('/api/signup', signupRouter);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend server API!' });
});

// Sample API Route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`- Local URL: http://localhost:${PORT}`);
});
