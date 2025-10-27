import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { json, urlencoded } from "express";
import { notFoundHandler, errorHandler } from "./middleware/errorHandlers.js";
import { bookRouter } from "./routes/book.route.js";
import { purchaseRouter } from "./routes/purchase.route.js";
import { dashboardRouter } from "./routes/dashboard.route.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";

export const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
