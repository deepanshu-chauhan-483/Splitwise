import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverallBalances, fetchGroupBalances, suggestSettlements, recordSettlement } from "../store/slices/balancesSlice";
import SettlementView from "../components/SettlementView";

export default function Balances() {
  const dispatch = useDispatch();
  const { overall, group, suggestions, loading } = useSelector((s) => s.balances);
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    dispatch(fetchOverallBalances());
  }, [dispatch]);

  const handleFetchGroup = () => {
    if (!groupId) return alert("Enter groupId to fetch");
    dispatch(fetchGroupBalances(groupId));
  };

  const handleSuggest = () => {
    if (!groupId) return alert("Enter groupId to suggest settlements");
    dispatch(suggestSettlements(groupId));
  };

  const handleRecord = (payload) => {
    // payload: { fromUser, toUser, amount }
    dispatch(recordSettlement({ groupId, ...payload }));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-bold">Overall balances</h2>
          {loading && <p>Loading...</p>}
          {!loading && overall.length === 0 && <p>No balances.</p>}
          <ul className="mt-3 space-y-1">
            {overall.map((b) => (
              <li key={b.userId} className="flex justify-between">
                <span>{b.userId}</span>
                <span className={b.amount > 0 ? "text-green-600" : "text-red-600"}>
                  {b.amount > 0 ? `Receivable ₹${b.amount}` : `Owes ₹${Math.abs(b.amount)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-bold">Group balances & settlements</h2>

          <div className="flex gap-2 mt-3">
            <input value={groupId} onChange={(e) => setGroupId(e.target.value)} placeholder="Enter groupId" className="border p-2 rounded w-full" />
            <button onClick={handleFetchGroup} className="px-3 py-2 bg-blue-600 text-white rounded">Fetch</button>
            <button onClick={handleSuggest} className="px-3 py-2 bg-indigo-600 text-white rounded">Suggest</button>
          </div>

          <div className="mt-4">
            {group.length === 0 ? <p>No group balances loaded.</p> :
              <ul className="space-y-1">
                {group.map((b) => (
                  <li key={b.user.id} className="flex justify-between">
                    <span>{b.user.name || b.user.id}</span>
                    <span className={b.amount > 0 ? "text-green-600" : "text-red-600"}>
                      {b.amount > 0 ? `Receivable ₹${b.amount}` : `Owes ₹${Math.abs(b.amount)}`}
                    </span>
                  </li>
                ))}
              </ul>
            }
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Suggested settlements</h3>
            <SettlementView transactions={suggestions} onRecord={handleRecord} />
          </div>
        </div>
      </div>
    </div>
  );
}
