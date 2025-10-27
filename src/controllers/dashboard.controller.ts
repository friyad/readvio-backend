import { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { ReferralModel } from "../models/referral.model.js";
import moment from "moment";
import { BookModel } from "../models/book.model.js";

export async function getDashboard(req: Request, res: Response): Promise<void> {
  const user = req.user;
  const userRes = await UserModel.findById(user?.id);
  if (!userRes) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // total credit earned by this user
  const totalCreditEarned = userRes.creditScore;

  // referrals by this user
  const referrals = await ReferralModel.find({ userId: userRes._id });

  // Number of referrals by this user
  const referredUsersCount = referrals.length;

  // Number of converted (purchased) users by this user
  const convertedUsersCount = referrals.filter(
    (referral) => referral.isConverted
  ).length;

  // Prepare chart data for the past 30 days
  const days: string[] = [];
  const referralsPerDay: { date: string; count: number }[] = [];
  const creditsPerDay: { date: string; creditEarned: number }[] = [];

  // Build last 30 days array and initialize chart data arrays
  for (let i = 29; i >= 0; i--) {
    const day = moment().subtract(i, "days").startOf("day");
    const formattedDate = day.format("YYYY-MM-DD");
    days.push(formattedDate);
    referralsPerDay.push({ date: formattedDate, count: 0 });
    creditsPerDay.push({ date: formattedDate, creditEarned: 0 });
  }

  // Group referrals by referredOn date for count and creditEarned sum
  referrals.forEach((referral) => {
    if (referral.referredOn) {
      const date = moment(referral.referredOn)
        .startOf("day")
        .format("YYYY-MM-DD");
      const dayIdx = days.indexOf(date);
      if (dayIdx !== -1) {
        referralsPerDay[dayIdx]!.count += 1;
        creditsPerDay[dayIdx]!.creditEarned += referral.creditEarned || 0;
      }
    }
  });

  res.status(200).json({
    data: {
      totalCreditEarned,
      referredUsersCount,
      convertedUsersCount,
      referralsPerDay,
      creditsPerDay,
    },
  });
}

export async function getReferrals(req: Request, res: Response): Promise<void> {
  const user = req.user;
  const userRes = await UserModel.findById(user?.id);
  if (!userRes) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const referrals = await ReferralModel.find({ userId: userRes._id }).lean();

  // Get the list of referred user IDs
  const referredUserIds = referrals.map((ref) => ref.referredUserId);

  // Fetch user data for all referredUserIds
  const referredUsers = await UserModel.find(
    {
      _id: { $in: referredUserIds },
    },
    { name: 1, email: 1 }
  ).lean();

  // Create a map for quick lookup
  const referredUsersMap: { [key: string]: { name?: string; email?: string } } =
    {};
  referredUsers.forEach((user) => {
    referredUsersMap[user._id.toString()] = {
      name: user.name,
      email: user.email,
    };
  });

  // Format the response for the table
  const referralTable = referrals.map((referral) => {
    const referredUser =
      referredUsersMap[referral.referredUserId?.toString() || ""];
    return {
      name: referredUser?.name || "-",
      email: referredUser?.email || "-",
      referredOn: referral.referredOn,
      isConverted: referral.isConverted,
      credits: referral.creditEarned || 0,
    };
  });
  res.status(200).json({ data: referralTable });
}

export async function getPurchasedBooks(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user;
  const userRes = await UserModel.findById(user?.id);
  if (!userRes) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Include duplicate books too
  const findBook = await BookModel.find({
    _id: { $in: userRes.purchasedBooks },
  }).lean();

  const booksMap = new Map(findBook.map((book) => [book._id.toString(), book]));

  const purchasedBooks = userRes.purchasedBooks
    .map((bookId: any) => booksMap.get(bookId.toString()))
    .filter(Boolean);

  res.status(200).json({ data: purchasedBooks });
}
