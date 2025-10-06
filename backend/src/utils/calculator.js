export function calculateSplit(amount, participants, splitType, splitDetails = []) {
  if (!participants?.length) throw new Error("Participants required");
  amount = Number(amount);

  if (splitType === "equal") {
    const share = parseFloat((amount / participants.length).toFixed(2));
    return participants.map((userId) => ({ userId, amount: share }));
  }

  if (splitType === "unequal") {
    const total = splitDetails.reduce((sum, d) => sum + Number(d.amount), 0);
    if (Math.abs(total - amount) > 0.01)
      throw new Error("Sum of unequal shares must equal total amount");
    return splitDetails.map((d) => ({ userId: d.userId, amount: Number(d.amount) }));
  }

  if (splitType === "percentage") {
    const totalPct = splitDetails.reduce((sum, d) => sum + Number(d.amount), 0);
    if (Math.abs(totalPct - 100) > 0.01)
      throw new Error("Percentages must total 100%");
    return splitDetails.map((d) => ({
      userId: d.userId,
      amount: parseFloat(((d.amount / 100) * amount).toFixed(2)),
    }));
  }

  throw new Error("Invalid split type");
}
