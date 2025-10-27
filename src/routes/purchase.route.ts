import { Router } from "express";
import { purchaseBook } from "../controllers/purchase.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const purchaseRouter = Router();

purchaseRouter.post("/", requireAuth, purchaseBook);
