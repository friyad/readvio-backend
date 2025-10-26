import { Request, Response } from "express";
import { BookModel } from "../models/book.model";
import { UserModel } from "../models/user.model";
import { ReferralModel } from "../models/referral.model";
import mongoose from "mongoose";

const REFERRAL_CREDIT = 2;

export async function purchaseBook(req: Request, res: Response): Promise<void> {
  const { bookId } = req.body;
  const user = req.user;

  const book = await BookModel.findById(bookId);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }

  const userRes = await UserModel.findById(user?.id);
  if (!userRes) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // check if it is first time purchase
  const isFirstTimePurchase = userRes.purchasedBooks.length === 0;

  // handle referral logic
  if (
    userRes.referredBy &&
    userRes.referredBy !== (user?.id as unknown as mongoose.Types.ObjectId) &&
    userRes.referredBy !== null &&
    isFirstTimePurchase
  ) {
    const referredByUser = await UserModel.findById(userRes.referredBy);

    if (referredByUser) {
      // add credit to referred by user (main user)
      referredByUser.creditScore += REFERRAL_CREDIT;
      await referredByUser.save();

      // add credit to user (referred user)
      userRes.creditScore += REFERRAL_CREDIT;

      // update referral that userId = referredByUser and referredUserId = user._id
      const referral = await ReferralModel.findOne({
        userId: referredByUser._id,
        referredUserId: userRes._id,
      });

      if (referral) {
        referral.isConverted = true;
        referral.creditEarned += REFERRAL_CREDIT;
        await referral.save();
      } else {
        await ReferralModel.create({
          userId: referredByUser._id,
          referredUserId: userRes._id,
          referredOn: new Date(),
          isConverted: true,
          creditEarned: REFERRAL_CREDIT,
        });
      }
    }
  }

  userRes.purchasedBooks.push(book._id);
  await userRes.save();
  res.status(200).json({ data: "Book purchased successfully" });
}
