// Extend Express Request to include user/session set by auth middleware
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email?: string;
      [key: string]: unknown;
    };
    session?: unknown;
  }
}
