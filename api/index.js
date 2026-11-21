import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/auth.js';
import workspaceRoutes from '../server/routes/workspaces.js';
import toolsRoutes from '../server/routes/tools.js';

dotenv.config();

const app = express();

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' }));

// Cached MongoDB Connection for Serverless
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection error.' });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, status: 'RankReady Full-Stack Online' });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tools', toolsRoutes);

app.use((err, req, res, next) => {
  console.error('API Error:', err.message);
  res.status(err.status || 500).json({ message: 'Internal server error.' });
});

export default app;