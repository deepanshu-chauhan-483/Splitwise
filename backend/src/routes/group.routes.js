import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  addMemberToGroup,
} from "../controllers/group.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);
router.post("/add-member", addMemberToGroup);

export default router;
