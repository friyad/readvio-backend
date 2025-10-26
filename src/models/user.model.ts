import mongoose, { Schema, Model } from "mongoose";
import { User } from "../types/user.type";

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, required: true, default: false },
    name: { type: String, required: true },
    image: { type: String, required: false, default: null },
    creditScore: { type: Number, required: true, default: 0 },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId || null,
      ref: "User",
      required: false,
      default: null,
    },
    referrals: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: false,
      default: [],
    },
    purchasedBooks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Book",
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel: Model<User> = mongoose.model<User>(
  "User",
  userSchema,
  "user"
);
