import dotenv from "dotenv";

dotenv.config();

const getNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: getNumber(process.env.PORT, 5000),
  MONGO_URI: process.env.MONGO_URI ?? "",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",
};
