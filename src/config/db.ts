import mongoose from "mongoose";
import { env } from "./env.js";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn__: Promise<typeof mongoose> | undefined;
}

export async function connectToDatabase(): Promise<void> {
  if (!global.__mongooseConn__) {
    global.__mongooseConn__ = mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }
  const connection = await global.__mongooseConn__;

  mongoose.connection.on("disconnected", () => {
    // eslint-disable-next-line no-console
    console.warn("MongoDB disconnected");
  });
  mongoose.connection.on("reconnected", () => {
    // eslint-disable-next-line no-console
    console.info("MongoDB reconnected");
  });

  // eslint-disable-next-line no-console
  console.log("MongoDB connected:", connection.connection.name);
}
