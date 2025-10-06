import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { suggestSettlements, recordSettlement } from "../controllers/settlements.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/group/:groupId", suggestSettlements);
router.post("/record", recordSettlement);

export default router;
