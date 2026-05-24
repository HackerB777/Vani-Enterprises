import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

interface MongoCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const g = global as typeof globalThis & { _mongoose?: MongoCache };
const cached: MongoCache = g._mongoose ?? { conn: null, promise: null };
g._mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
