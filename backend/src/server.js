import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { connectMongo } from './config/mongo.js';
import { initModelsAndSeed } from './models/index.js';

const startServer = async () => {
  try {
    console.log('====================================================');
    console.log('  INSTITUTE OF ENGINEERING & MANAGEMENT (IEM)       ');
    console.log('  Centralized Admission System REST API Server       ');
    console.log('====================================================');

    // 1. Connect to SQL Database (MySQL / SQLite fallback)
    await connectDB();

    // 2. Initialize Models & Auto-Seed default Admin & Departments
    await initModelsAndSeed();

    // 3. Connect to MongoDB (optional document store)
    await connectMongo();

    // 4. Start HTTP Server
    app.listen(env.PORT, '0.0.0.0', () => {
      console.log(`[Server] Live on http://localhost:${env.PORT}`);
      console.log(`[Server] Network access: http://0.0.0.0:${env.PORT}`);
      console.log(`[Server] API base endpoint: http://localhost:${env.PORT}${env.API_PREFIX}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
};

startServer();
