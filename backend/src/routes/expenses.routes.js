import express from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpense,
  getGroupExpenses
} from "../controllers/expenses.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.get("/group/:groupId", getGroupExpenses);

router.delete("/:id", deleteExpense);

export default router;
