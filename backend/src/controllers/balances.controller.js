import  Expense  from "../models/Expense.model.js";

/**
 * Calculate net balances for a set of expenses.
 * Returns object: { userId: netAmount } (positive => should receive, negative => owes)
 */
function computeNetFromExpenses(expenses) {
  const net = {}; // { userId: number }
  for (const exp of expenses) {
    const paidById = exp.paidBy.toString();
    // credit payer the full amount
    net[paidById] = (net[paidById] || 0) + Number(exp.amount);

    // for each split detail, subtract their share
    for (const sd of exp.splitDetails) {
      const uid = sd.userId.toString();
      net[uid] = (net[uid] || 0) - Number(sd.amount);
    }
  }
  return net;
}

// GET /api/balances  -> overall balances across groups for current user
export const getOverallBalances = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // find all expenses where user is participant OR payer (helps include all relevant)
    const expenses = await Expense.find({ participants: userId })
      .populate("paidBy", "name email")
      .populate("participants", "name email");

    // compute net per user across all expenses the current user appears in
    // BUT user likely wants balances relative to others: for simplicity, return net map for the group of users found
    const net = computeNetFromExpenses(expenses);

    // convert to array with user info pulled from participant lists (best-effort)
    // We'll include entries where net != 0
    const result = Object.entries(net).map(([userId, amt]) => ({ userId, amount: Number(amt.toFixed(2)) }))
      .filter(r => r.amount !== 0);

    res.json({ balances: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/balances/group/:groupId -> balances for a specific group
export const getGroupBalances = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Find all expenses for this group
    const expenses = await Expense.find({ groupId })
      .populate("paidBy", "name email")
      .populate("participants", "name email");

    const net = computeNetFromExpenses(expenses);

    // Optionally, attach user info: since participants were populated, we can build map
    // Build set of user IDs from expenses participants and paidBy
    const usersMap = {};
    for (const e of expenses) {
      if (e.paidBy) usersMap[e.paidBy._id] = { id: e.paidBy._id, name: e.paidBy.name, email: e.paidBy.email };
      for (const p of e.participants) {
        usersMap[p._id] = { id: p._id, name: p.name, email: p.email };
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
