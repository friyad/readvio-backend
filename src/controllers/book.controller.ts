import { Request, Response } from "express";
import { BookModel } from "../models/book.model";

export async function listBooks(_req: Request, res: Response): Promise<void> {
  const books = await BookModel.find({}).lean();
  res.json(books);
}

export async function getBook(req: Request, res: Response): Promise<void> {
  const book = await BookModel.findById(req.params.id).lean();
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  res.json(book);
}

export async function createBook(req: Request, res: Response): Promise<void> {
  const created = await BookModel.create(req.body);
  res.status(201).json(created);
}

export async function updateBook(req: Request, res: Response): Promise<void> {
  const updated = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  res.json(updated);
}

export async function deleteBook(req: Request, res: Response): Promise<void> {
  const deleted = await BookModel.findByIdAndDelete(req.params.id).lean();
  if (!deleted) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  res.status(204).send();
}
