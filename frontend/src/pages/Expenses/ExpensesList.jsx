"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchExpenses, deleteExpense } from "../../store/slices/expensesSlice"
import ExpenseCard from "../../components/expenses/ExpenseCard"
import { Link } from "react-router-dom"

export default function ExpensesList() {
  const dispatch = useDispatch()
  const { list, loading } = useSelector((s) => s.expenses)

  useEffect(() => {
    dispatch(fetchExpenses())
  }, [dispatch])

  const handleDelete = (id) => dispatch(deleteExpense(id))

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Your Expenses</h2>
            <p className="text-slate-600 text-sm">Track all shared and personal expenses.</p>
          </div>
          <Link
            to="/expenses/add"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 transition"
          >
            + Add Expense
          </Link>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-600">Loading...</p>
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-10 text-center text-slate-600">
            No expenses yet. Click "Add Expense" to create your first expense.
          </div>
        )}

        <div className="space-y-3">
          {list.map((e) => (
            <ExpenseCard key={e._id} expense={e} onDelete={handleDelete} />
          ))}
        </div>
      </section>
    </main>
  )
}