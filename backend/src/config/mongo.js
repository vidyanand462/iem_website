import mongoose from 'mongoose';
import { env } from './env.js';

let isMongoConnected = false;

export const connectMongo = async () => {
  try {
    // Set short timeout to avoid hanging if MongoDB isn't running locally
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log('[Mongo] MongoDB connection established successfully.');
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[Mongo] MongoDB unavailable (${error.message}). Document metadata will fallback to SQL/Local store.`);
  }
};

export const getMongoStatus = () => isMongoConnected;

export default mongoose;
