"use client";
import React from "react";

export default function ExpenseCard({ expense, onDelete, onEdit }) {
  const { description, amount, paidBy, participants } = expense;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{description}</h3>
        <p className="text-sm text-slate-500">
          Paid by{" "}
          <span className="font-medium text-slate-700">
            {paidBy?.name || "Unknown"}
          </span>{" "}
          • {participants?.length || 0} people
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm sm:text-base font-semibold text-blue-600">
          ₹{amount}
        </span>
        <button
          onClick={() => {
            console.log("🟡 Edit clicked for:", expense.description);
            onEdit?.(expense);
          }}
          aria-label="Edit expense"
          className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(expense._id)}
          aria-label="Delete expense"
          className="inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
