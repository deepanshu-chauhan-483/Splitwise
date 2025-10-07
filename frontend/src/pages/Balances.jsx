"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOverallBalances,
  fetchGroupBalances,
  suggestSettlements,
  recordSettlement,
} from "../store/slices/balancesSlice";
import { fetchGroups } from "../store/slices/groupsSlice";
import SettlementView from "../components/SettlementView";

export default function Balances() {
  const dispatch = useDispatch();

  // Redux slices
  const { overall, group: groupBalances, suggestions, loading } = useSelector(
    (s) => s.balances
  );
  const groups = useSelector((s) => s.groups?.list || []);

  // Local state
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [busyRecording, setBusyRecording] = useState(false);

  // Load groups & overall balances initially
  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchOverallBalances());
  }, [dispatch]);

  // Auto-select first group once available
  useEffect(() => {
    if (!selectedGroupId && groups && groups.length > 0) {
      setSelectedGroupId(groups[0]._id);
    }
  }, [groups, selectedGroupId]);

  // Fetch group balances when selected group changes
  useEffect(() => {
    if (selectedGroupId) {
      dispatch(fetchGroupBalances(selectedGroupId));
    }
  }, [dispatch, selectedGroupId]);

  // Handlers
  const handleSelectGroup = (e) => setSelectedGroupId(e.target.value);

  const handleSuggest = () => {
    if (!selectedGroupId) return alert("Select a group first.");
    dispatch(suggestSettlements(selectedGroupId));
  };

  const handleRecord = async (tx) => {
  if (!selectedGroupId) return alert("Select a group first.");
  if (!tx || !tx.from || !tx.to || !tx.amount) return;

  const payload = {
    groupId: selectedGroupId,
    fromUser: tx.from.id || tx.from,
    toUser: tx.to.id || tx.to,
    amount: tx.amount,
  };

  try {
    setBusyRecording(true);
    // unwrap so errors throw here
    await dispatch(recordSettlement(payload)).unwrap();

    // wait a tiny tick for backend to persist (usually not needed)
    // but occasionally ensures race-safety with subsequent GETs:
    await new Promise((r) => setTimeout(r, 150));

    // refresh data AFTER successful record
    await dispatch(fetchGroupBalances(selectedGroupId)).unwrap();
    await dispatch(suggestSettlements(selectedGroupId)).unwrap();
    await dispatch(fetchOverallBalances()).unwrap();

    // friendly UX
    alert("Settlement recorded and balances refreshed.");
  } catch (err) {
    console.error("recordSettlement error:", err);
    alert(err?.message || "Failed to record settlement.");
  } finally {
    setBusyRecording(false);
  }
};


  // Memoized lists
  const overallList = useMemo(() => overall || [], [overall]);
  const groupList = useMemo(() => groupBalances || [], [groupBalances]);
  const suggestionsList = useMemo(() => suggestions || [], [suggestions]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Balances</h1>
        <p className="mt-1 text-slate-600">
          Review your overall and group-wise balances, suggest settlements, and
          record payments.
        </p>
      </header>

      {/* OVERALL BALANCES */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Overall balances
          </h2>
          <button
            onClick={() => dispatch(fetchOverallBalances())}
            className="text-sm text-blue-600 hover:underline rounded focus-visible:ring-2 focus-visible:ring-blue-200"
          >
            Refresh
          </button>
        </div>

        <div className="mt-3">
          {loading && overallList.length === 0 ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : overallList.length === 0 ? (
            <p className="text-sm text-slate-600">No balances to show.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {overallList.map((b, i) => {
                const userObj = b.user || {};
                const name = userObj.name || "Unknown User";
                const email = userObj.email ? ` (${userObj.email})` : "";
                const label = `${name}${email}`;

                return (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="font-medium text-slate-900">{label}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium ring-1 ${
                        b.amount > 0
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : "bg-rose-50 text-rose-700 ring-rose-200"
                      }`}
                    >
                      {b.amount > 0
                        ? `Receivable ₹${b.amount}`
                        : `Owes ₹${Math.abs(b.amount)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* GROUP BALANCES + SETTLEMENTS */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Group balances & settlements
          </h2>
          <div className="flex items-center gap-3">
            <label
              htmlFor="groupSelect"
              className="mr-2 hidden text-sm text-slate-600 sm:inline"
            >
              Group:
            </label>
            <select
              id="groupSelect"
              value={selectedGroupId}
              onChange={handleSelectGroup}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select group...</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                selectedGroupId && dispatch(fetchGroupBalances(selectedGroupId))
              }
              disabled={!selectedGroupId}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-blue-200 ${
                selectedGroupId
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
              }`}
            >
              Refresh
            </button>

            <button
              onClick={handleSuggest}
              disabled={!selectedGroupId}
              className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-200 ${
                selectedGroupId
                  ? "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                  : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              Suggest settlements
            </button>
          </div>
        </div>

        {/* Group balances list */}
        <div className="mt-4">
          {!selectedGroupId ? (
            <p className="text-sm text-slate-600">
              Select a group to view balances.
            </p>
          ) : groupList.length === 0 ? (
            <p className="text-sm text-slate-600">
              No balances for this group.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {groupList.map((b, i) => {
                const userObj = b.user || {};
                const name = userObj.name || "Unknown User";
                const email = userObj.email ? ` (${userObj.email})` : "";
                const label = `${name}${email}`;

                return (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="font-medium text-slate-900">{label}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium ring-1 ${
                        b.amount > 0
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : "bg-rose-50 text-rose-700 ring-rose-200"
                      }`}
                    >
                      {b.amount > 0
                        ? `Receivable ₹${b.amount}`
                        : `Owes ₹${Math.abs(b.amount)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Suggested settlements */}
        <div className="mt-6">
          <h3 className="mb-2 font-semibold text-slate-900">
            Suggested settlements
          </h3>
          {suggestionsList.length === 0 ? (
            <p className="text-sm text-slate-600">
              No suggestions yet. Click “Suggest settlements”.
            </p>
          ) : (
            <div>
              <SettlementView
                transactions={suggestionsList}
                onRecord={(tx) => {
                  if (busyRecording) return;
                  handleRecord(tx);
                }}
              />
              {busyRecording && (
                <p className="mt-2 text-sm text-slate-500">
                  Recording settlement...
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
