export function calculateSplit(amount, participants, splitType, splitDetails = []) {
  if (!participants?.length) throw new Error("Participants required");
  amount = Number(amount);

  if (splitType === "equal") {
    const share = parseFloat((amount / participants.length).toFixed(2));
    const parts = participants.map((userId) => ({ userId, amount: share }));
    // fix rounding diff by adjusting last participant
    const total = parts.reduce((s, p) => s + Number(p.amount), 0);
    const diff = parseFloat((amount - total).toFixed(2));
    if (Math.abs(diff) > 0) {
      parts[parts.length - 1].amount = parseFloat((parts[parts.length - 1].amount + diff).toFixed(2));
    }
    return parts;
  }

  if (splitType === "unequal") {
    const total = splitDetails.reduce((sum, d) => sum + Number(d.amount), 0);
    const diff = parseFloat((amount - total).toFixed(2));
    // allow small rounding and adjust last share if tiny diff
    const shares = splitDetails.map((d) => ({ userId: d.userId, amount: parseFloat(Number(d.amount).toFixed(2)) }));
    if (Math.abs(diff) > 0.05) {
      throw new Error("Sum of unequal shares must equal total amount");
    }
    if (Math.abs(diff) > 0) {
      // adjust last participant share to match total
      const last = shares[shares.length - 1];
      last.amount = parseFloat((last.amount + diff).toFixed(2));
    }
    return shares;
  }

  if (splitType === "percentage") {
    const totalPct = splitDetails.reduce((sum, d) => sum + Number(d.amount), 0);
    if (Math.abs(totalPct - 100) > 0.01)
      throw new Error("Percentages must total 100%");
    const parts = splitDetails.map((d) => ({
      userId: d.userId,
      amount: parseFloat(((d.amount / 100) * amount).toFixed(2)),
    }));
    // fix rounding so sum equals amount
    const totalPctAmount = parts.reduce((s, p) => s + Number(p.amount), 0);
    const diffPct = parseFloat((amount - totalPctAmount).toFixed(2));
    if (Math.abs(diffPct) > 0) {
      parts[parts.length - 1].amount = parseFloat((parts[parts.length - 1].amount + diffPct).toFixed(2));
    }
    return parts;
  }

  throw new Error("Invalid split type");
}
