// backend/src/utils/optimizer.js
export function optimizeSettlements(netMap) {
  // build creditors and debtors arrays with positive amounts
  const creditors = [];
  const debtors = [];

  for (const [userId, rawAmt] of Object.entries(netMap)) {
    const amt = Math.round((Number(rawAmt) || 0) * 100) / 100;
    if (Math.abs(amt) < 0.01) continue;
    if (amt > 0) creditors.push({ userId, amount: amt });
    else debtors.push({ userId, amount: -amt });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const c = creditors[i];
    const d = debtors[j];
    const transfer = Math.round(Math.min(c.amount, d.amount) * 100) / 100;

    if (transfer <= 0) break;

    transactions.push({ from: d.userId, to: c.userId, amount: transfer });

    c.amount = Math.round((c.amount - transfer) * 100) / 100;
    d.amount = Math.round((d.amount - transfer) * 100) / 100;

    if (c.amount < 0.01) i++;
    if (d.amount < 0.01) j++;
  }

  return transactions;
}
