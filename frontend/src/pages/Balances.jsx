"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchOverallBalances,
  fetchGroupBalances,
  suggestSettlements,
  recordSettlement,
} from "../store/slices/balancesSlice"
import { fetchGroups } from "../store/slices/groupsSlice"
import userService from "../services/user.service"
import SettlementView from "../components/SettlementView"

/**
 * Balances page
 * - shows overall balances (mapped to user names when possible)
 * - allows selecting a group (from user's groups)
 * - fetches group balances, suggests settlements, allows recording settlement
 *
 * Assumptions:
 * - groupsSlice exposes `list` (array of groups)
 * - balancesSlice exposes overall (array), group (array), suggestions (array), loading (bool)
 * - userService.getAllUsers() returns array of users [{ _id, name, email }]
 * - suggestSettlements returns transactions with { from: { id, name }, to: { id, name }, amount }
 */

export default function Balances() {
  const dispatch = useDispatch()

  // balances slice
  const { overall, group: groupBalances, suggestions, loading } = useSelector((s) => s.balances)

  // groups slice
  const groups = useSelector((s) => s.groups?.list || [])

  // local state
  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [usersMap, setUsersMap] = useState({}) // id -> user object
  const [busyRecording, setBusyRecording] = useState(false)

  // helpers
  const toId = (u) => {
    if (!u) return null
    if (typeof u === "string") return u
    if (u.id) return u.id
    if (u._id) return String(u._id)
    return null
  }

  // 1) initial load: groups + overall balances + users
  useEffect(() => {
    dispatch(fetchGroups()) // populate groups
    dispatch(fetchOverallBalances()) // populate overall balances
    // fetch all users so we can map user ids -> names for overall list
    ;(async () => {
      try {
        const res = await userService.getAllUsers()
        const users = res.data || []
        const map = {}
        users.forEach((u) => {
          const id = toId(u)
          if (id) map[id] = u
        })
        setUsersMap(map)
      } catch (err) {
        // don't crash the page if user list fails
        console.warn("Failed to load users for name mapping", err)
      }
    })()
  }, [dispatch])

  // 2) when groups are loaded, if no selectedGroupId pick first group automatically
  useEffect(() => {
    if (!selectedGroupId && groups && groups.length > 0) {
      setSelectedGroupId(groups[0]._id)
    }
  }, [groups, selectedGroupId])

  // 3) when selectedGroupId changes, fetch group balances
  useEffect(() => {
    if (selectedGroupId) {
      dispatch(fetchGroupBalances(selectedGroupId))
      // clear previous suggestions for clarity (optional)
      // we don't clear suggestions via slice here - keep existing unless refreshed by suggestSettlements
    }
  }, [dispatch, selectedGroupId])

  // Handlers
  const handleSelectGroup = (e) => {
    setSelectedGroupId(e.target.value)
  }

  const handleSuggest = () => {
    if (!selectedGroupId) {
      return alert("Please select a group to generate suggestions.")
    }
    dispatch(suggestSettlements(selectedGroupId))
  }

  const handleRecord = async (tx) => {
    // tx expected shape: { from: { id, name }, to: { id, name }, amount }
    if (!selectedGroupId) {
      return alert("Please select a group before recording a settlement.")
    }
    if (!tx || !tx.from || !tx.to || !tx.amount) return

    const payload = {
      groupId: selectedGroupId,
      fromUser: tx.from.id || tx.from, // tolerate either string or object
      toUser: tx.to.id || tx.to,
      amount: tx.amount,
    }

    try {
      setBusyRecording(true)
      // recordSettlement is a thunk; unwrap to catch errors
      // dispatch(recordSettlement(payload)).unwrap() requires thunk to return promise with unwrap; but we can use .then/.catch too
      await dispatch(recordSettlement(payload)).unwrap()
      alert("Settlement recorded successfully.")
      // refresh balances and suggestions so UI stays in sync
      dispatch(fetchGroupBalances(selectedGroupId))
      dispatch(suggestSettlements(selectedGroupId))
      dispatch(fetchOverallBalances())
    } catch (err) {
      console.error("Failed to record settlement:", err)
      const message = (err && err.message) || "Failed to record settlement"
      alert(message)
    } finally {
      setBusyRecording(false)
    }
  }

  // render helpers
  const overallList = useMemo(() => overall || [], [overall])
  const groupList = useMemo(() => groupBalances || [], [groupBalances])
  const suggestionsList = useMemo(() => suggestions || [], [suggestions])

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Balances</h1>
        <p className="mt-1 text-slate-600">
          Review overall amounts and group balances. Select a group to view per-group balances and suggested
          settlements.
        </p>
      </header>

      {/* Overall balances */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Overall balances</h2>
          <button
            onClick={() => dispatch(fetchOverallBalances())}
            className="text-sm text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 rounded"
            aria-label="Refresh overall balances"
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
                const userObj = b.user || usersMap[b.userId] || {}
                const name = userObj.name || userObj.fullName || "Unknown User"
                const email = userObj.email ? ` (${userObj.email})` : ""
                const label = `${name}${email}`

                return (
                  <li key={i} className="flex items-center justify-between py-2" aria-live="polite">
                    <span className="font-medium text-slate-900">{label}</span>
                    <span
                      className={
                        "rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium ring-1 " +
                        (b.amount > 0
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : "bg-rose-50 text-rose-700 ring-rose-200")
                      }
                    >
                      {b.amount > 0 ? `Receivable ₹${b.amount}` : `Owes ₹${Math.abs(b.amount)}`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Group selector + balances & suggestions */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Group balances & settlements</h2>
          <div className="flex items-center gap-3">
            <label htmlFor="groupSelect" className="mr-2 hidden text-sm text-slate-600 sm:inline">
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
              onClick={() => selectedGroupId && dispatch(fetchGroupBalances(selectedGroupId))}
              disabled={!selectedGroupId}
              className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${
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
              className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${
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
            <p className="text-sm text-slate-600">Select a group to load balances and suggestions.</p>
          ) : groupList.length === 0 ? (
            <p className="text-sm text-slate-600">No balances for this group.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {groupList.map((b, i) => {
                const userObj = b.user || {}
                const name = userObj.name || "Unknown User"
                const email = userObj.email ? ` (${userObj.email})` : ""
                const label = `${name}${email}`

                return (
                  <li key={i} className="flex items-center justify-between py-2">
                    <span className="font-medium text-slate-900">{label}</span>
                    <span
                      className={
                        "rounded-full px-2.5 py-1 text-xs sm:text-sm font-medium ring-1 " +
                        (b.amount > 0
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : "bg-rose-50 text-rose-700 ring-rose-200")
                      }
                    >
                      {b.amount > 0 ? `Receivable ₹${b.amount}` : `Owes ₹${Math.abs(b.amount)}`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Suggested settlements */}
        <div className="mt-6">
          <h3 className="mb-2 font-semibold text-slate-900">Suggested settlements</h3>
          {suggestionsList.length === 0 ? (
            <p className="text-sm text-slate-600">No suggested transfers. Click "Suggest settlements" to compute.</p>
          ) : (
            <div>
              <SettlementView
                transactions={suggestionsList}
                onRecord={(tx) => {
                  // SettlementView will call onRecord with the transaction object (populated {from:{id,name},to:{...},amount})
                  if (busyRecording) return
                  handleRecord(tx)
                }}
              />
              {busyRecording && <p className="mt-2 text-sm text-slate-500">Recording settlement...</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
