import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';
import { initModelsAndSeed } from '../backend/src/models/index.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await connectDB();
      await initModelsAndSeed();
      initialized = true;
    } catch (err) {
      console.error('[Vercel Serverless Function] Init error:', err);
    }
  }
  return app(req, res);
}
