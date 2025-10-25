import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { json, urlencoded } from "express";
import { notFoundHandler, errorHandler } from "./middleware/errorHandlers";
import { bookRouter } from "./routes/book.route";

export const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/books", bookRouter);

app.use(notFoundHandler);
app.use(errorHandler);
