import mongoose, { Schema, Model } from "mongoose";
import { Referral } from "../types/referral.type";

const referralSchema = new Schema<Referral>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredOn: { type: Date, required: true },
    isConverted: { type: Boolean, required: true, default: false },
    creditEarned: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const ReferralModel: Model<Referral> = mongoose.model<Referral>(
  "Referral",
  referralSchema
);
