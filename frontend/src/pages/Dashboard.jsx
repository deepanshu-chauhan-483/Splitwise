"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchGroups } from "../store/slices/groupsSlice"
import { fetchExpenses } from "../store/slices/expensesSlice"
import GroupCard from "../components/groups/GroupCard"
import RecentActivity from "../components/dashboard/RecentActivity"
import QuickAddExpenseModal from "../components/dashboard/QuickAddExpenseModal"

export default function Dashboard() {
  const dispatch = useDispatch()
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const { list: groups } = useSelector((s) => s.groups)
  const { list: expenses } = useSelector((s) => s.expenses)
  const { user } = useSelector((s) => s.auth)

  useEffect(() => {
    dispatch(fetchGroups())
    dispatch(fetchExpenses())
  }, [dispatch])

  const cardClass = "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition"

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {user?.name || "there"}</h1>
        <p className="text-slate-600 mt-1">Manage your shared expenses, groups, and balances — all in one place.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/expenses/add"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition"
          >
            Add Expense
          </Link>
          <button
            onClick={() => setShowQuickAdd(true)}
            className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-blue-700 font-medium hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition"
          >
            Quick Add
          </button>
        </div>
      </header>

      {/* Dashboard Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 grid md:grid-cols-3 gap-8">
        {/* Left: Activity + Links */}
        <div className="md:col-span-2 space-y-8">
          {/* Recent Activity */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
              <Link to="/expenses" className="text-blue-600 text-sm font-medium hover:underline">
                View All →
              </Link>
            </div>
            <RecentActivity expenses={expenses} />
          </div>

          {/* Quick Links */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Links</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { name: "Groups", path: "/groups" },
                { name: "Balances", path: "/balances" },
                { name: "Users", path: "/users" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Groups + Summary */}
        <div className="space-y-8">
          {/* Groups */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Your Groups</h2>
              {groups.length > 0 && (
                <Link to="/groups" className="text-blue-600 text-sm font-medium hover:underline">
                  View All →
                </Link>
              )}
            </div>

            {groups.length === 0 ? (
              <p className="text-sm text-slate-600">
                No groups yet.{" "}
                <Link to="/groups/add" className="text-blue-600 font-medium hover:underline">
                  Create one →
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {groups.map((g) => (
                  <GroupCard key={g._id} group={g} />
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className={cardClass}>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Summary</h2>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>
                Total Groups: <strong className="text-slate-900">{groups.length}</strong>
              </li>
              <li>
                Total Expenses: <strong className="text-slate-900">{expenses.length}</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Add Modal */}
      <QuickAddExpenseModal open={showQuickAdd} onClose={() => setShowQuickAdd(false)} groups={groups} />
    </main>
  )
}
