import { Router } from "express";
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

export const bookRouter = Router();

bookRouter.get("/", listBooks);
bookRouter.get("/:id", getBook);
bookRouter.post("/", createBook);
bookRouter.put("/:id", updateBook);
bookRouter.delete("/:id", deleteBook);
