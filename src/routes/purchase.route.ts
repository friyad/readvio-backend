import { Router } from "express";
import { purchaseBook } from "../controllers/purchase.controller";
import { requireAuth } from "../middleware/requireAuth";

export const purchaseRouter = Router();

purchaseRouter.post("/", requireAuth, purchaseBook);
