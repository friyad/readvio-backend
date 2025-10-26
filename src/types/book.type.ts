import mongoose, { Document } from "mongoose";

export type Price = {
  currency: string;
  amount: number;
  formatted: string;
};

export interface Book extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  coverImageUrl: string;
  placeholderImageUrl: string;
  rating: number;
  ratingCount: number;
  tags?: string[];
  description?: string;
  price?: Price;
  createdAt: Date;
  updatedAt: Date;
}
