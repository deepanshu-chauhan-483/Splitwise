import React, { useState } from "react";
import ConfirmModal from "./ui/ConfirmModal";

export default function SettlementView({ transactions = [], onRecord }) {
  const [confirmData, setConfirmData] = useState(null);

  const handleConfirm = (t) => setConfirmData(t);

  const handleProceed = () => {
    onRecord(confirmData);
    setConfirmData(null);
  };

  if (!transactions || transactions.length === 0)
    return <div>No suggested transfers — everyone is settled.</div>;

  return (
    <div className="space-y-3">
      {transactions.map((t, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
        >
          <div>
            <p className="text-sm">
              <span className="font-medium">{t.from.name}</span> →{" "}
              <span className="font-medium">{t.to.name}</span>
            </p>
            <p className="text-xs text-gray-500">Amount: ₹{t.amount}</p>
          </div>
          <div>
            <button
              onClick={() => handleConfirm(t)}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Mark paid
            </button>
          </div>
        </div>
      ))}

      <ConfirmModal
        open={!!confirmData}
        onClose={() => setConfirmData(null)}
        onConfirm={handleProceed}
        message={
          confirmData
            ? `${confirmData.from.name} will pay ₹${confirmData.amount} to ${confirmData.to.name}. Confirm?`
            : ""
        }
      />
    </div>
  );
}
