import { NextFunction, Request, Response } from "express";

export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({ message: "Not Found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(status).json({ message });
}
