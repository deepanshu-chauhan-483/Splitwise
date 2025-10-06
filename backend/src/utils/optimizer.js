/**
 * Given map of userId -> netAmount (positive = should receive, negative = owes),
 * returns an array of transactions { from, to, amount } that settles debts.
 *
 * This greedy algorithm repeatedly matches largest creditor with largest debtor.
 */
export function optimizeSettlements(netMap) {
  // Build arrays of creditors and debtors; convert amounts to numbers and ignore near-zero
  const creditors = [];
  const debtors = [];

  for (const [userId, amtRaw] of Object.entries(netMap)) {
    const amt = Number(Number(amtRaw).toFixed(2));
    if (Math.abs(amt) < 0.01) continue;
    if (amt > 0) creditors.push({ userId, amount: amt });
    else debtors.push({ userId, amount: -amt }); // store positive debt
  }

  // sort descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const cred = creditors[i];
    const debt = debtors[j];
    const transfer = Math.min(cred.amount, debt.amount);

    transactions.push({
      from: debt.userId,
      to: cred.userId,
      amount: Number(transfer.toFixed(2))
    });

    cred.amount = Number((cred.amount - transfer).toFixed(2));
    debt.amount = Number((debt.amount - transfer).toFixed(2));

    if (Math.abs(cred.amount) < 0.01) i++;
    if (Math.abs(debt.amount) < 0.01) j++;
  }

  return transactions;
}
