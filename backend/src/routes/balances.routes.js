import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getOverallBalances, getGroupBalances } from "../controllers/balances.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getOverallBalances);
router.get("/group/:groupId", getGroupBalances);

export default router;
