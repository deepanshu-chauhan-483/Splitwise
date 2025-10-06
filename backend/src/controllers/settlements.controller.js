import  Expense  from "../models/Expense.model.js";
import { Settlement } from "../models/Settlement.model.js";
import { optimizeSettlements } from "../utils/optimizer.js";
import User from "../models/User.model.js";


/**
 * Helper to compute the net balance map for a given group.
 * Positive = user is owed money.
 * Negative = user owes money.
 */
async function computeNetForGroup(groupId) {
  const expenses = await Expense.find({ groupId });
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
 * GET /api/settlements/group/:groupId
 * -> Suggest settlements between members of a group
 */
export const suggestSettlements = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const net = await computeNetForGroup(groupId);
    const transactions = optimizeSettlements(net);

    // Populate user names for each transaction
    const userIds = [
      ...new Set(transactions.flatMap((t) => [t.from, t.to])),
    ];

    const users = await User.find({ _id: { $in: userIds } }).select("name _id");
    const nameMap = Object.fromEntries(
      users.map((u) => [u._id.toString(), u.name])
    );

    const populated = transactions.map((t) => ({
      from: { id: t.from, name: nameMap[t.from] || "Unknown" },
      to: { id: t.to, name: nameMap[t.to] || "Unknown" },
      amount: t.amount,
    }));

    res.json({ transactions: populated });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/settlements/record
 * -> Record a settlement transaction between two users
 */
export const recordSettlement = async (req, res, next) => {
  try {
    const { groupId = null, fromUser, toUser, amount, note = "" } = req.body;

    if (!fromUser || !toUser || !amount) {
      return res
        .status(400)
        .json({ message: "fromUser, toUser, and amount are required" });
    }

    const createdBy = req.user.id;

    const settlement = await Settlement.create({
      groupId,
      fromUser,
      toUser,
      amount: Number(amount),
      note,
      createdBy,
    });

    res.status(201).json(settlement);
  } catch (err) {
    next(err);
  }
};
