import Expense from "../models/Expense.model.js";
import User from "../models/User.model.js";
import { optimizeSettlements } from "../utils/optimizer.js";

/**
 * Helper: Compute net balance map from an array of expenses.
 * Positive => user should receive money
 * Negative => user owes money
 */
function computeNetFromExpenses(expenses) {
  const net = {};
  for (const exp of expenses) {
    const paidById = exp.paidBy.toString();
    net[paidById] = (net[paidById] || 0) + Number(exp.amount);

    for (const sd of exp.splitDetails) {
      const uid = sd.userId.toString();
      net[uid] = (net[uid] || 0) - Number(sd.amount);
    }
  }
  return net;
}

/**
 * GET /api/balances
 * Overall balances across all groups for current user
 */
export const getOverallBalances = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ participants: userId })
      .populate("paidBy", "name email")
      .populate("participants", "name email");

    const net = computeNetFromExpenses(expenses);

    const result = Object.entries(net)
      .map(([uid, amt]) => ({ userId: uid, amount: Number(amt.toFixed(2)) }))
      .filter(r => r.amount !== 0);

    res.json({ balances: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/balances/group/:groupId
 * Balances for a specific group
 */
export const getGroupBalances = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId })
      .populate("paidBy", "name email")
      .populate("participants", "name email");

    const net = computeNetFromExpenses(expenses);

    // Build user info map from expenses
    const usersMap = {};
    for (const e of expenses) {
      if (e.paidBy) usersMap[e.paidBy._id] = {
        id: e.paidBy._id,
        name: e.paidBy.name,
        email: e.paidBy.email
      };
      for (const p of e.participants) {
        usersMap[p._id] = {
          id: p._id,
          name: p.name,
          email: p.email
        };
      }
    }

    const balances = Object.entries(net).map(([uid, amt]) => ({
      user: usersMap[uid] || { id: uid },
      amount: Number(amt.toFixed(2))
    }));

    res.json({ balances });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/balances/group/:groupId/suggest
 * Optional: Suggest settlements for the group using optimizeSettlements
 */
export const suggestGroupSettlements = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId });
    const net = computeNetFromExpenses(expenses);
    const transactions = optimizeSettlements(net);

    // Optional: attach user names
    const userIds = [...new Set(transactions.flatMap(t => [t.from, t.to]))];
    const users = await User.find({ _id: { $in: userIds } }).select("name _id");
    const nameMap = Object.fromEntries(users.map(u => [u._id.toString(), u.name]));

    const populated = transactions.map(t => ({
      from: { id: t.from, name: nameMap[t.from] || "Unknown" },
      to: { id: t.to, name: nameMap[t.to] || "Unknown" },
      amount: t.amount
    }));

    res.json({ transactions: populated });
  } catch (err) {
    next(err);
  }
};
