import mongoose, { Schema, Model } from "mongoose";
import { Book, Price } from "../types/book.type";

const PriceSchema = new Schema<Price>({
  amount: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: "USD" },
  formatted: { type: String, required: true, default: "0.00" },
});

const bookSchema = new Schema<Book>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    coverImageUrl: { type: String, required: false, trim: true },
    rating: { type: Number, required: true, default: 0 },
    ratingCount: { type: Number, required: true, default: 0 },
    tags: { type: [String], required: false, default: [] },
    description: { type: String, required: false, trim: true },
    price: { type: PriceSchema, required: false, default: null },
  },
  { timestamps: true }
);

export const BookModel: Model<Book> = mongoose.model<Book>("Book", bookSchema);
