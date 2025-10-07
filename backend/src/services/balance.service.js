// balance.service.js
import { Expense } from "../models/Expense.model.js";

export async function computeNetMapForGroup(groupId) {
  const expenses = await Expense.find({ groupId });
  const net = {};
  for (const exp of expenses) {
    const paidBy = exp.paidBy.toString();
    net[paidBy] = (net[paidBy] || 0) + Number(exp.amount);
    for (const sd of exp.splitDetails) {
      const uid = sd.userId.toString();
      net[uid] = (net[uid] || 0) - Number(sd.amount);
    }
  }
  return net;
}
