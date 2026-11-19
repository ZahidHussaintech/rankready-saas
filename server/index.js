import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspaces.js';

dotenv.config();

const app = express();

// Security Headers
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));

// Health Check Endpoint (Used by cron-job.org every 10 mins to prevent Render sleep)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'RankReady SaaS API Online',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, dbState: mongoose.connection.readyState });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

// Global Crash-Prevention Error Middleware
app.use((err, req, res, next) => {
  console.error('Handled Server Error:', err.message);
  res.status(err.status || 500).json({
    message: 'Something went wrong on the server. Please try again.',
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas Connected for RankReady SaaS');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });