import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = session.user as unknown as {
      id: string;
      email?: string;
      [key: string]: unknown;
    };
    // Optionally expose the whole session if needed by handlers
    (req as any).session = session;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
