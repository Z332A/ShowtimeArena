// lib/db.ts
import mongoose, { Mongoose } from 'mongoose';

// 1) Check environment variable
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// 2) Provide a global cache. We'll name it 'mongooseCache'
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((conn: Mongoose) => conn);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
