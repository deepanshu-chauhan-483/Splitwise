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

    // Debit each participant
    for (const sd of exp.splitDetails || []) {
      const uid = sd.userId.toString();
      const share = Number(sd.amount) || 0;
      net[uid] = (net[uid] || 0) - share;
    }
  }

  return net;
}

/* -------------------------------------------------------------------------- */
/* 🔹 Helper: Apply recorded settlements                                      */
/*    Settlement reduces debt of fromUser and receivable of toUser            */
/* -------------------------------------------------------------------------- */
async function applySettlementsToNet(net, groupId) {
  const settlements = await Settlement.find({ groupId }).lean();

  for (const s of settlements) {
    const from = s.fromUser.toString();
    const to = s.toUser.toString();
    const amt = Number(s.amount) || 0;

    // fromUser has paid 'amt' to toUser
    net[from] = (net[from] || 0) + amt; // reduces debt
    net[to] = (net[to] || 0) - amt;     // reduces receivable
  }
}

/* -------------------------------------------------------------------------- */
/* 🔹 GET /api/settlements/group/:groupId                                     */
/*    Suggest optimal settlement transactions for the group                   */
/* -------------------------------------------------------------------------- */
export const suggestSettlements = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ message: "groupId parameter is required" });
    }

    // Compute current net balances
    const net = await computeNetForGroup(groupId);
    await applySettlementsToNet(net, groupId);

    // Run settlement optimization
    const transactions = optimizeSettlements(net);

    // Fetch user names
    const userIds = [...new Set(transactions.flatMap(t => [t.from, t.to]))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email _id").lean();

    const nameMap = Object.fromEntries(users.map(u => [u._id.toString(), u.name]));

    const populated = transactions.map(t => ({
      from: { id: t.from, name: nameMap[t.from] || "Unknown" },
      to: { id: t.to, name: nameMap[t.to] || "Unknown" },
      amount: Number(t.amount.toFixed(2)),
    }));

    return res.json({ groupId, transactions: populated });
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

    // Validation
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
        .json({ message: "amount must be a positive number." });
    }

    // Verify both users exist
    const [fromExists, toExists] = await Promise.all([
      User.exists({ _id: fromUser }),
      User.exists({ _id: toUser }),
    ]);
    if (!fromExists || !toExists) {
      return res.status(404).json({ message: "One or both users not found." });
    }

    // Record settlement
    const createdBy = req.user?.id || null;
    const settlement = await Settlement.create({
      groupId,
      fromUser,
      toUser,
      amount: amt,
      note,
      createdBy,
    });

    return res.status(201).json({
      message: "Settlement recorded successfully.",
      settlement,
    });
  } catch (err) {
    console.error("❌ Error in recordSettlement:", err);
    next(err);
  }
};
