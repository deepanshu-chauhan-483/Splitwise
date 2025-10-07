// users.routes.js
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { listUsers, getUserById } from "../controllers/users.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", listUsers);
router.get("/:id", getUserById);

export default router;
