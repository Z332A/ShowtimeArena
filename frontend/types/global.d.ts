// types/global.d.ts
import type { Mongoose } from 'mongoose';

declare global {
  // You can name it anything, e.g. 'mongooseCache'
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

// Make file a module by exporting something
export {};
