import React, { useState } from "react";
import ConfirmModal from "./ui/ConfirmModal";

export default function SettlementView({ transactions = [], onRecord }) {
  const [confirmData, setConfirmData] = useState(null);

  const handleConfirm = (t) => setConfirmData(t);

  const handleProceed = () => {
    if (confirmData) {
      onRecord(confirmData);
      setConfirmData(null);
    }
  };

  if (!transactions || transactions.length === 0)
    return (
      <div className="text-center text-gray-500 mt-4">
        No suggested transfers — everyone is settled.
      </div>
    );

  return (
    <div className="space-y-3">
      {transactions.map((t, idx) => {
        const fromName = t?.from?.name || "Unknown";
        const toName = t?.to?.name || "Unknown";
        const amount = t?.amount ?? 0;

        return (
          <div
            key={idx}
            className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="text-sm">
                <span className="font-medium">{fromName}</span> →{" "}
                <span className="font-medium">{toName}</span>
              </p>
              <p className="text-xs text-gray-500">Amount: ₹{amount}</p>
            </div>
            <div>
              <button
                onClick={() => handleConfirm(t)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Mark Paid
              </button>
            </div>
          </div>
        );
      })}

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmData}
        onClose={() => setConfirmData(null)}
        onConfirm={handleProceed}
        message={
          confirmData
            ? `${confirmData.from?.name || "Unknown"} will pay ₹${
                confirmData.amount ?? 0
              } to ${confirmData.to?.name || "Unknown"}. Confirm?`
            : ""
        }
      />
    </div>
  );
}
