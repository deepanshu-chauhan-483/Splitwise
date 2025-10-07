// RecentActivity.jsx
import React from "react";

export default function RecentActivity({ expenses = [] }) {
  if (!expenses || expenses.length === 0) return <div>No recent activity.</div>;

  return (
    <ul className="space-y-2">
      {expenses.slice(0, 6).map(e => (
        <li key={e._id} className="bg-white p-3 rounded shadow flex justify-between">
          <div>
            <div className="font-medium">{e.description}</div>
            <div className="text-xs text-gray-500">Paid by {e.paidBy?.name || "Unknown"}</div>
          </div>
          <div className="font-semibold">₹{e.amount}</div>
        </li>
      ))}
    </ul>
  );
}
