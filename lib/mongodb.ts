import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not set');
const uri = MONGODB_URI;

interface MongoCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const g = global as typeof globalThis & { _mongoose?: MongoCache };
const cached: MongoCache = g._mongoose ?? { conn: null, promise: null };
g._mongoose = cached;

/** Strip ObjectId / Date instances so lean() results are safe to pass as Server→Client props. */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow retry on next request
    throw err;
  }
  return cached.conn;
}
