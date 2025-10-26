import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { json, urlencoded } from "express";
import { notFoundHandler, errorHandler } from "./middleware/errorHandlers";
import { bookRouter } from "./routes/book.route";
import { purchaseRouter } from "./routes/purchase.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth";

export const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/books", bookRouter);
app.use("/api/v1/purchase", purchaseRouter);

app.use(notFoundHandler);
app.use(errorHandler);
