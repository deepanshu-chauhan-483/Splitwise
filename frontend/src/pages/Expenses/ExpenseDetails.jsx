"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import expenseService from "../../services/expense.service"

export default function ExpenseDetails() {
  const { id } = useParams()
  const [expense, setExpense] = useState(null)

  useEffect(() => {
    expenseService.getExpenseById(id).then((res) => setExpense(res.data))
  }, [id])

  if (!expense) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-slate-600">Loading...</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Link to="/expenses" className="text-sm text-blue-600 hover:underline">
          ← Back to Expenses
        </Link>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 space-y-4">
          <header>
            <h2 className="text-xl font-semibold text-slate-900">{expense.description}</h2>
            <p className="text-slate-600 text-sm">Split Type: {expense.splitType}</p>
          </header>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-blue-50 text-blue-700 px-3 py-2 font-medium">Amount: ₹{expense.amount}</div>
            <div className="rounded-lg bg-slate-100 text-slate-800 px-3 py-2 font-medium">
              Paid by: {expense.paidBy?.name}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Split Details</h3>
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
              {expense.splitDetails.map((d, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                  <span className="text-slate-700">{d.userId?.name || d.userId}</span>
                  <span className="font-medium text-slate-900">₹{d.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}