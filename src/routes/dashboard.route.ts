import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  getDashboard,
  getReferrals,
  getPurchasedBooks,
} from "../controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAuth, getDashboard);
dashboardRouter.get("/referrals", requireAuth, getReferrals);
dashboardRouter.get("/purchased-books", requireAuth, getPurchasedBooks);
