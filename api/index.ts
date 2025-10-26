import { Request, Response } from "express";
import { app } from "../src/app";
import { connectToDatabase } from "../src/config/db";
import http from "http";

let server: http.Server | null = null;
let initialized = false;

async function ensureInitialized(): Promise<void> {
  if (!initialized) {
    await connectToDatabase();
    server = http.createServer(app);
    initialized = true;
  }
}

export default async function handler(req: Request, res: Response) {
  await ensureInitialized();
  if (!server) {
    res.status(500).send("Server not initialized");
    return;
  }
  (server as any).emit("request", req, res);
}
