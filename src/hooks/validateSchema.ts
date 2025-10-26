// Validate the request body against the schema
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema = <T>(schema: ZodSchema<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
      return next(error);
    }
  };
};
