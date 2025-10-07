import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupService from "../../services/group.service";
import expenseService from "../../services/expense.service";
import balanceService from "../../services/balance.service";
import SettlementView from "../../components/SettlementView";

export default function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    groupService.getGroupById(id).then((res) => setGroup(res.data));
    expenseService.getGroupExpenses(id).then((res) => setExpenses(res.data));
    balanceService
      .getGroupBalances(id)
      .then((res) => setBalances(res.data.balances));
  }, [id]);

  const handleAddMember = async () => {
    const res = await groupService.addMember({ groupId: id, email });
    setGroup(res.data);
    setEmail("");
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
      {/* Group Info */}
      <div className="bg-white p-6 rounded shadow space-y-3">
        <h2 className="text-xl font-bold">{group.name}</h2>
        <p className="text-gray-600">{group.description}</p>
        <h3 className="font-semibold mt-4 mb-2">Members:</h3>
        <ul className="list-disc ml-5 space-y-1 text-gray-700">
          {group.members.map((m) => (
            <li key={m._id}>
              {m.name} ({m.email})
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to add"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddMember}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Add Member
          </button>
        </div>
      </div>

      {/* Expenses & Balances */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="font-bold text-lg mb-2">Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {expenses.map((e) => (
              <li key={e._id}>
                {e.description} — ₹{e.amount} (Paid by {e.paidBy?.name})
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-bold text-lg mt-4 mb-2">Balances</h3>
        <SettlementView transactions={balances} onRecord={() => {}} />
      </div>
    </div>
  );
}
