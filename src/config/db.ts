import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectToDatabase(): Promise<void> {
  const connection = await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    // socketTimeoutMS: 45000, // optional tuning
  });

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
