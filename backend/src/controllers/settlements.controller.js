import Expense from "../models/Expense.model.js";
import Settlement from "../models/Settlement.model.js";
import User from "../models/User.model.js";
import { optimizeSettlements } from "../utils/optimizer.js";

/* -------------------------------------------------------------------------- */
/* 🔹 Helper: Compute net balance map for a given group                        */
/*    Positive = user should receive money                                    */
/*    Negative = user owes money                                              */
/* -------------------------------------------------------------------------- */
async function computeNetForGroup(groupId) {
  const expenses = await Expense.find({ groupId }).lean();
  const net = {};

  for (const exp of expenses) {
    const paidById = exp.paidBy.toString();
    const amount = Number(exp.amount) || 0;

    // Credit payer
    net[paidById] = (net[paidById] || 0) + amount;

    // Debit participants
    for (const sd of exp.splitDetails || []) {
      const uid = sd.userId.toString();
      const share = Number(sd.amount) || 0;
      net[uid] = (net[uid] || 0) - share;
    }
  }

  return net;
}

/* -------------------------------------------------------------------------- */
/* 🔹 Helper: Apply recorded settlements to net balances                      */
/*    Settlement reduces debt of fromUser and receivable of toUser            */
/* -------------------------------------------------------------------------- */
async function applySettlementsToNet(net, groupId) {
  const settlements = await Settlement.find({ groupId }).lean();

  for (const s of settlements) {
    const from = s.fromUser.toString();
    const to = s.toUser.toString();
    const amt = Number(s.amount) || 0;

    // fromUser pays -> debt reduced
    net[from] = (net[from] || 0) + amt;
    // toUser receives -> receivable reduced
    net[to] = (net[to] || 0) - amt;
  }
}

/* -------------------------------------------------------------------------- */
/* 🔹 GET /api/settlements/group/:groupId                                     */
/*    Suggest optimized settlement transactions for the group                 */
/* -------------------------------------------------------------------------- */
export const suggestSettlements = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    if (!groupId) return res.status(400).json({ message: "groupId is required" });

    // Compute up-to-date balances
    const net = await computeNetForGroup(groupId);
    await applySettlementsToNet(net, groupId);

    // If everyone is settled (all near 0), still return empty set but indicate balanced
    const allZero = Object.values(net).every(v => Math.abs(v) < 0.01);
    if (allZero) {
      return res.json({
        message: "All members are settled up.",
        groupId,
        transactions: [],
      });
    }

    // Optimize settlements again, even after multiple records
    const transactions = optimizeSettlements(net);

    // Fetch involved users
    const userIds = [...new Set(transactions.flatMap(t => [t.from, t.to]))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email _id").lean();
    const nameMap = Object.fromEntries(users.map(u => [u._id.toString(), u.name]));

    // Populate user info
    const populated = transactions.map(t => ({
      from: { id: t.from, name: nameMap[t.from] || "Unknown" },
      to: { id: t.to, name: nameMap[t.to] || "Unknown" },
      amount: Number(t.amount.toFixed(2)),
    }));

    return res.status(200).json({
      message: "Suggested settlements generated successfully.",
      groupId,
      transactions: populated,
    });
  } catch (err) {
    console.error("❌ Error in suggestSettlements:", err);
    next(err);
  }
};


/* -------------------------------------------------------------------------- */
/* 🔹 POST /api/settlements/record                                            */
/*    Record a manual or confirmed settlement                                 */
/* -------------------------------------------------------------------------- */
export const recordSettlement = async (req, res, next) => {
  try {
    const { groupId = null, fromUser, toUser, amount, note = "" } = req.body;

    // ✅ Validate input
    if (!fromUser || !toUser || !amount) {
      return res
        .status(400)
        .json({ message: "fromUser, toUser, and amount are required." });
    }
    if (fromUser === toUser) {
      return res
        .status(400)
        .json({ message: "fromUser and toUser must be different." });
    }

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number." });
    }

    // ✅ Verify users exist
    const [fromExists, toExists] = await Promise.all([
      User.exists({ _id: fromUser }),
      User.exists({ _id: toUser }),
    ]);
    if (!fromExists || !toExists) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    // ✅ Record settlement
    const createdBy = req.user?.id || null;
    const settlement = await Settlement.create({
      groupId,
      fromUser,
      toUser,
      amount: amt,
      note,
      createdBy,
    });

    // ✅ Immediately return updated group balances for UI sync
    let updatedNet = await computeNetForGroup(groupId);
    await applySettlementsToNet(updatedNet, groupId);

    const updatedBalances = Object.entries(updatedNet).map(([uid, value]) => ({
      userId: uid,
      amount: Number(value.toFixed(2)),
    }));

    return res.status(201).json({
      message: "Settlement recorded successfully.",
      settlement,
      updatedBalances,
    });
  } catch (err) {
    console.error("❌ Error in recordSettlement:", err);
    next(err);
  }
};
