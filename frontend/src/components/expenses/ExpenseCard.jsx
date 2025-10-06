import React from "react";

export default function ExpenseCard({ expense, onDelete }) {
  const { description, amount, paidBy, participants } = expense;

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm">
      <div>
        <h3 className="font-semibold text-gray-800">{description}</h3>
        <p className="text-sm text-gray-500">
          Paid by <span className="font-medium">{paidBy?.name}</span> •{" "}
          {participants.length} people
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-blue-600">₹{amount}</span>
        <button
          onClick={() => onDelete(expense._id)}
          className="text-red-500 text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
