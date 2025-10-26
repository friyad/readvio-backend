import mongoose, { Document } from "mongoose";

export interface Referral extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  referredOn: Date;
  isConverted: boolean;
  creditEarned: number;
}
