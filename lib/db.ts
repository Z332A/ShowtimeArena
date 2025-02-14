import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global caching to prevent multiple connections in development mode.
 */
let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {}).then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Store the connection globally to avoid reconnecting
(global as any).mongoose = cached;

export default connectDB;
