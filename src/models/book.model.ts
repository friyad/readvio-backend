import mongoose, { Schema, Document, Model } from "mongoose";

export interface Book extends Document {
  title: string;
  author: string;
  publishedYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<Book>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    publishedYear: { type: Number },
  },
  { timestamps: true }
);

export const BookModel: Model<Book> = mongoose.model<Book>("Book", bookSchema);
