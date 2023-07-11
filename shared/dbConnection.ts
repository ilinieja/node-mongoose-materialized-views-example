import mongoose from "mongoose";

/**
 * Prevent the app from starting if there's no DB.
 */
const DATABASE_URI = process.env.DATABASE_URI || "";
if (!DATABASE_URI) {
  throw new Error("No DATABASE_URI provided in env");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: any;
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnection() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(DATABASE_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export function DbConnection() {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      await dbConnection();
      const result = await originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}

export default dbConnection;
