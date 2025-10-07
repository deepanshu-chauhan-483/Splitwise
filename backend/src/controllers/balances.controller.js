// backend/src/controllers/balances.controller.js
import Expense from "../models/Expense.model.js";
import User from "../models/User.model.js";
import Settlement from "../models/Settlement.model.js";
import { optimizeSettlements } from "../utils/optimizer.js";

/* Small helper */
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

/**
 * Compute net balances from an array of expense docs.
 * Net keys are string userIds.
 */
function computeNetFromExpenses(expenses) {
  const net = {};

  for (const exp of expenses) {
    const amount = Number(exp.amount) || 0;
    const paidById = exp.paidBy ? String(exp.paidBy) : null;
    if (paidById) net[paidById] = round2((net[paidById] || 0) + amount);

    // If explicit splitDetails are present, use them.
    if (Array.isArray(exp.splitDetails) && exp.splitDetails.length > 0) {
      for (const sd of exp.splitDetails) {
        const uid = String(sd.userId);
        const share = round2(sd.amount || 0);
        net[uid] = round2((net[uid] || 0) - share);
      }
      continue;
    }

    // Fallback: if participants present, split equally among them
    const participants = Array.isArray(exp.participants) && exp.participants.length > 0
      ? exp.participants.map((p) => String(p))
      : [];

    if (participants.length > 0) {
      // calculate equal shares with rounding adjustments
      const base = Math.floor((amount / participants.length) * 100) / 100; // truncate to 2 decimals
      let assigned = 0;
      for (let i = 0; i < participants.length; i++) {
        const uid = participants[i];
        const share = (i === participants.length - 1)
          ? round2(amount - assigned) // last participant picks up rounding remainder
          : round2(base);
        assigned = round2(assigned + share);
        net[uid] = round2((net[uid] || 0) - share);
      }
    }
  }

  // Remove near-zero entries
  for (const k of Object.keys(net)) {
    if (Math.abs(net[k]) < 0.01) net[k] = 0;
  }

  return net;
}

/* Apply recorded settlements to net (group only) */
async function applyRecordedSettlements(net, groupId) {
  const recorded = await Settlement.find({ groupId }).lean();
  for (const s of recorded) {
    const from = String(s.fromUser);
    const to = String(s.toUser);
    const amt = Number(s.amount) || 0;
    // from paid amt to to
    net[from] = round2((net[from] || 0) + amt);
    net[to] = round2((net[to] || 0) - amt);
  }
}

/* ---------------- GET /api/balances ---------------- */
export const getOverallBalances = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // fetch all expenses where current user participated or paid
    const expenses = await Expense.find({
      $or: [{ participants: userId }, { paidBy: userId }],
    }).lean();

    const net = computeNetFromExpenses(expenses);

    // populate user info for all ids in net
    const userIds = Object.keys(net);
    const users = await User.find({ _id: { $in: userIds } }).select("name email _id").lean();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), { id: String(u._id), name: u.name, email: u.email }]));

    const balances = userIds
      .map((uid) => ({ user: userMap[uid] || { id: uid }, amount: Number(net[uid].toFixed(2)) }))
      .filter((b) => b.amount !== 0);

    return res.json({ balances });
  } catch (err) {
    next(err);
  }
};

/* --------------- GET /api/balances/group/:groupId --------------- */
export const getGroupBalances = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    if (!groupId) return res.status(400).json({ message: "groupId required" });

    const expenses = await Expense.find({ groupId }).lean();
    const net = computeNetFromExpenses(expenses);
    await applyRecordedSettlements(net, groupId);

    const userIds = Object.keys(net);
    const users = await User.find({ _id: { $in: userIds } }).select("name email _id").lean();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), { id: String(u._id), name: u.name, email: u.email }]));

    const balances = userIds
      .map((uid) => ({ user: userMap[uid] || { id: uid }, amount: Number(net[uid].toFixed(2)) }))
      .filter((b) => b.amount !== 0);

    return res.json({ balances });
  } catch (err) {
    next(err);
  }
};

/* --------------- GET /api/balances/group/:groupId/suggest --------------- */
/* Optional route — compute optimization and return transactions */
export const suggestGroupSettlements = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    if (!groupId) return res.status(400).json({ message: "groupId required" });

    const expenses = await Expense.find({ groupId }).lean();
    const net = computeNetFromExpenses(expenses);
    await applyRecordedSettlements(net, groupId);

    const transactions = optimizeSettlements(net);

    const userIds = [...new Set(transactions.flatMap((t) => [t.from, t.to]))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email _id").lean();
    const nameMap = Object.fromEntries(users.map((u) => [String(u._id), { id: String(u._id), name: u.name, email: u.email }]));

    const populated = transactions.map((t) => ({
      from: nameMap[t.from] || { id: t.from, name: "Unknown" },
      to: nameMap[t.to] || { id: t.to, name: "Unknown" },
      amount: Number(t.amount.toFixed(2)),
    }));

    return res.json({ transactions: populated });
  } catch (err) {
    next(err);
  }
};
