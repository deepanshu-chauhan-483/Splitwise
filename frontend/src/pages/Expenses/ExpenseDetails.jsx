import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import expenseService from "../../services/expense.service";

export default function ExpenseDetails() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    expenseService.getExpenseById(id).then((res) => setExpense(res.data));
  }, [id]);

  if (!expense) return <div>Loading...</div>;

  return (
    <div className="flex justify-center">
      <div className="max-w-lg bg-white shadow p-6 rounded">
        <h2 className="text-xl font-bold mb-2">{expense.description}</h2>
        <p className="text-gray-600 mb-1">Amount: ₹{expense.amount}</p>
        <p className="text-gray-600 mb-1">Paid by: {expense.paidBy?.name}</p>
        <p className="text-gray-600 mb-3">Split Type: {expense.splitType}</p>

        <h3 className="font-semibold mb-2">Split Details:</h3>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          {expense.splitDetails.map((d, i) => (
            <li key={i}>
              {d.userId?.name || d.userId}: ₹{d.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
