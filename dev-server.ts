/**
 * Local development server that emulates Vercel serverless functions.
 * This runs alongside the Vite dev server (which proxies /api/* to this).
 * 
 * Usage: npx tsx dev-server.ts
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Dynamically load Vercel-style function handlers
// Simulates Vercel's file-based routing for /api/*

app.get('/api/rovers', async (req, res) => {
  const handler = (await import('./api/rovers/index')).default;
  handler(req as never, res as never);
});

app.get('/api/rovers/:rover/photos', async (req, res) => {
  // Inject the route param into query to match Vercel's behavior
  req.query.rover = req.params.rover;
  const handler = (await import('./api/rovers/[rover]/photos')).default;
  handler(req as never, res as never);
});

app.get('/api/rovers/:rover/manifest', async (req, res) => {
  req.query.rover = req.params.rover;
  const handler = (await import('./api/rovers/[rover]/manifest')).default;
  handler(req as never, res as never);
});

app.listen(PORT, () => {
  console.log(`[dev-server] API proxy running on http://localhost:${PORT}`);
  console.log(`[dev-server] NASA_API_KEY: ${process.env.NASA_API_KEY ? 'set' : 'NOT SET'}`);
});
