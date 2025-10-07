"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import groupService from "../../services/group.service";
import expenseService from "../../services/expense.service";
import balanceService from "../../services/balance.service";
import SettlementView from "../../components/SettlementView";

export default function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    groupService.getGroupById(id).then((res) => setGroup(res.data));
    expenseService.getGroupExpenses(id).then((res) => setExpenses(res.data));
    balanceService
      .getGroupBalances(id)
      .then((res) => setBalances(res.data.balances));
    // fetch suggested settlements for this group (optional)
    balanceService.getGroupSettlements(id).then((res) => {
      // API returns { transactions: [...] } or an array directly depending on backend
      const data = res.data;
      setSuggestions(data.transactions || data || []);
    });
  }, [id]);

  const handleAddMember = async () => {
    const res = await groupService.addMember({ groupId: id, email });
    setGroup(res.data);
    setEmail("");
  };

  const inputClass =
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const cardClass = "rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200";

  if (!group) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={cardClass}>
            <p className="text-slate-600">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Link to="/groups" className="text-sm text-blue-600 hover:underline">
          ← Back to Groups
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Group Info */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900">
              {group.name}
            </h2>
            <p className="text-slate-600">{group.description}</p>

            <h3 className="text-sm font-semibold text-slate-900 mt-4 mb-2">
              Members
            </h3>
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 text-sm">
              {group.members.map((m) => (
                <li
                  key={m._id}
                  className="px-4 py-2 flex items-center justify-between"
                >
                  <span className="text-slate-700">{m.name}</span>
                  <span className="text-slate-500">{m.email}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <label
                htmlFor="memberEmail"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Add member by email
              </label>
              <input
                id="memberEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
              />
              <button
                onClick={handleAddMember}
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition"
              >
                Add Member
              </button>
            </div>
          </div>

          {/* Expenses & Balances */}
          <div className={cardClass}>
            <h3 className="text-lg font-semibold text-slate-900">Expenses</h3>
            {expenses.length === 0 ? (
              <div className="mt-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                No expenses yet.
              </div>
            ) : (
              <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 text-sm">
                {expenses.map((e) => (
                  <li
                    key={e._id}
                    className="px-4 py-2 flex items-center justify-between"
                  >
                    <span className="text-slate-700">{e.description}</span>
                    <span className="text-slate-500">
                      ₹{e.amount} • Paid by {e.paidBy?.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="text-lg font-semibold text-slate-900 mt-6">
              Balances
            </h3>
            <div className="mt-2">
              <SettlementView
                transactions={suggestions}
                onRecord={async (tx) => {
                  if (!tx) return;
                  try {
                    // payload expects groupId, fromUser, toUser, amount
                    await balanceService.recordSettlement({
                      groupId: id,
                      fromUser: tx.from?.id || tx.from,
                      toUser: tx.to?.id || tx.to,
                      amount: tx.amount,
                    });
                    // refresh balances and suggestions
                    const bRes = await balanceService.getGroupBalances(id);
                    setBalances(bRes.data.balances);
                    const sRes = await balanceService.getGroupSettlements(id);
                    const sData = sRes.data;
                    setSuggestions(sData.transactions || sData || []);
                    alert("Settlement recorded");
                  } catch (err) {
                    console.error("Failed to record settlement", err);
                    alert("Failed to record settlement");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
