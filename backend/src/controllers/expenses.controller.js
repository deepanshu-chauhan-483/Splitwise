import Expense from "../models/Expense.model.js";
import { calculateSplit } from "../utils/calculator.js";

// Create expense
export const createExpense = async (req, res, next) => {
  try {
    const { description, amount, participants: reqParticipants, splitType, splitDetails, groupId } = req.body;
    const paidBy = req.user.id;

    const participants = reqParticipants && reqParticipants.length ? reqParticipants : [paidBy];

    const computedSplits = calculateSplit(amount, participants, splitType, splitDetails);

    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      participants,
      splitType,
      splitDetails: computedSplits,
      groupId: groupId || null,
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

// Get all expenses for logged-in user
export const getAllExpenses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ participants: userId })
      .populate("paidBy", "name email")
      .populate("participants", "name email")
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// Get single expense
export const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id)
      .populate("paidBy", "name email")
      .populate("participants", "name email");
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

// Update expense
export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, amount, participants: reqParticipants, splitType, splitDetails, groupId } = req.body;
    const userId = req.user.id;

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Only the payer can edit the expense
    if (expense.paidBy.toString() !== userId)
      return res.status(403).json({ message: "Not authorized to edit this expense" });

    // Update logic
    const participants = reqParticipants && reqParticipants.length ? reqParticipants : expense.participants;
    const computedSplits = calculateSplit(amount, participants, splitType, splitDetails);

    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.participants = participants;
    expense.splitType = splitType || expense.splitType;
    expense.splitDetails = computedSplits;
    expense.groupId = groupId || expense.groupId;

    await expense.save();

    const updatedExpense = await Expense.findById(id)
      .populate("paidBy", "name email")
      .populate("participants", "name email");

    res.json(updatedExpense);
  } catch (err) {
    next(err);
  }
};


export const getGroupExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const expenses = await Expense.find({ groupId })
      .populate("paidBy", "name email")
      .populate("participants", "name email")
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};


// Delete expense (only payer)
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.paidBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this expense" });

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    next(err);
  }
};
