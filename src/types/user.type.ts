import mongoose, { Document } from "mongoose";

export interface User extends Document {
  //   _id: mongoose.Types.ObjectId;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  creditScore: number;
  referredBy: mongoose.Types.ObjectId | null;
  referrals: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
